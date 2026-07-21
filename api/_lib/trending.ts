import type { Category, Country, Video } from '../../src/types/video.js';
import {
  CATEGORY_TO_YT_ID,
  filterHowtoBucket,
  SHARED_HOWTO_CATEGORIES,
} from './categories.js';
import {
  getCache,
  setCache,
  TRENDING_CACHE_TTL_MS,
  withCache,
} from './cache.js';
import {
  fetchChannelSubscribers,
  fetchMostPopular,
  fetchSearch,
  parseIsoDurationToSeconds,
  type YtVideoItem,
} from './youtubeClient.js';

const REGION_CODE: Record<Exclude<Country, 'global'>, string> = {
  us: 'US',
  jp: 'JP',
  kr: 'KR',
};

// CATEGORY_TO_YT_ID의 중복 제거된 카테고리 id 목록 (26은 food/beauty가 공유).
const DISTINCT_CATEGORY_IDS: string[] = Array.from(
  new Set(Object.values(CATEGORY_TO_YT_ID) as string[]),
);

// mostPopular 카테고리 풀이 부족할 때 키워드 검색으로 보강하는 쿼리. (food/beauty)
const SUPPLEMENT_QUERIES: Record<string, Record<'food' | 'beauty', string>> = {
  KR: { food: '먹방 요리 레시피', beauty: '메이크업 뷰티 스킨케어' },
  US: { food: 'food recipe cooking', beauty: 'makeup beauty skincare' },
  JP: { food: '料理 グルメ 食べ', beauty: '美容 メイクアップ スキンケア' },
};

// '전체' 풀은 일반 트렌드 + 모든 카테고리 트렌드를 합친 것이라 매우 커질 수 있어
// 조회수 상위 N개만 남긴다. (구독자 조회 비용·페이로드 크기 제한 목적)
const ALL_POOL_LIMIT = 150;

function pickThumbnail(item: YtVideoItem) {
  const t = item.snippet.thumbnails;
  return t.high?.url ?? t.medium?.url ?? t.default?.url ?? '';
}

function viewsOf(item: YtVideoItem) {
  return Number(item.statistics.viewCount ?? 0);
}

async function toVideos(
  items: YtVideoItem[],
  country: Exclude<Country, 'global'>,
): Promise<Video[]> {
  const subMap = await fetchChannelSubscribers(
    items.map((i) => i.snippet.channelId),
  );

  return items.map((item) => ({
    id: item.id,
    title: item.snippet.title,
    channelId: item.snippet.channelId,
    channelName: item.snippet.channelTitle,
    thumbnailUrl: pickThumbnail(item),
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    country,
    viewCount: viewsOf(item),
    likeCount: Number(item.statistics.likeCount ?? 0),
    subscriberCount: subMap.get(item.snippet.channelId) ?? 0,
    publishedAt: item.snippet.publishedAt,
    durationSeconds: parseIsoDurationToSeconds(item.contentDetails.duration),
  }));
}

/** 일반(카테고리 없는) 트렌드 원본을 국가별로 캐싱한다. */
async function getRawGeneral(
  country: Exclude<Country, 'global'>,
): Promise<YtVideoItem[]> {
  const key = `raw:${country}:general`;
  const cached = getCache<YtVideoItem[]>(key);
  if (cached) return cached;

  const items = await fetchMostPopular(REGION_CODE[country]);
  setCache(key, items, TRENDING_CACHE_TTL_MS);
  return items;
}

/**
 * 특정 YouTube 카테고리 id의 트렌드 원본을 국가별로 캐싱한다.
 * 일부 국가/카테고리는 mostPopular 차트를 지원하지 않아 오류가 나는데,
 * 그 경우 빈 배열로 처리한다.
 */
async function getRawByCategoryId(
  country: Exclude<Country, 'global'>,
  categoryId: string,
): Promise<YtVideoItem[]> {
  const key = `raw:${country}:cat:${categoryId}`;
  const cached = getCache<YtVideoItem[]>(key);
  if (cached) return cached;

  let items: YtVideoItem[] = [];
  try {
    items = await fetchMostPopular(REGION_CODE[country], categoryId);
    // YouTube mostPopular 차트는 요청한 카테고리 외의 영상을 반환하기도 한다.
    // 영상에 부여된 실제 categoryId로 재필터링해 카테고리 간 중복 노출을 방지한다.
    items = items.filter(
      (item) => !item.snippet.categoryId || item.snippet.categoryId === categoryId,
    );
  } catch (err) {
    console.error(`[getRawByCategoryId] ${country} cat:${categoryId}`, err);
    items = [];
  }
  setCache(key, items, TRENDING_CACHE_TTL_MS);
  return items;
}

/**
 * '전체' 풀 = 일반 트렌드 ∪ 모든 카테고리 트렌드 (중복 제거).
 * 이렇게 해야 각 카테고리 목록이 '전체'의 부분집합이 되어,
 * 예를 들어 음악 1위 영상이 '전체'에서도 반드시 후보에 포함된다 (정렬 일관성 보장).
 */
async function getAllPool(
  country: Exclude<Country, 'global'>,
): Promise<YtVideoItem[]> {
  const lists = await Promise.all([
    getRawGeneral(country),
    ...DISTINCT_CATEGORY_IDS.map((id) => getRawByCategoryId(country, id)),
  ]);

  const merged = new Map<string, YtVideoItem>();
  for (const list of lists) {
    for (const item of list) {
      if (!merged.has(item.id)) merged.set(item.id, item);
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => viewsOf(b) - viewsOf(a))
    .slice(0, ALL_POOL_LIMIT);
}

/**
 * food/beauty 카테고리 풀이 부족할 때 키워드 검색으로 보강한다.
 * 캐싱되므로 TTL 안에서 YouTube Search API 호출은 최초 1회만 발생한다.
 */
async function getRawBySearch(
  country: Exclude<Country, 'global'>,
  category: 'food' | 'beauty',
): Promise<YtVideoItem[]> {
  const key = `raw:${country}:search:${category}`;
  const cached = getCache<YtVideoItem[]>(key);
  if (cached) return cached;

  const regionCode = REGION_CODE[country];
  const q = SUPPLEMENT_QUERIES[regionCode]?.[category];
  let items: YtVideoItem[] = [];
  if (q) {
    try {
      items = await fetchSearch(regionCode, q);
    } catch {
      items = [];
    }
  }
  setCache(key, items, TRENDING_CACHE_TTL_MS);
  return items;
}

async function getRawItems(
  country: Exclude<Country, 'global'>,
  category: Category,
): Promise<YtVideoItem[]> {
  if (category === 'all') {
    return getAllPool(country);
  }

  if (SHARED_HOWTO_CATEGORIES.includes(category)) {
    const pool = await getRawByCategoryId(country, CATEGORY_TO_YT_ID[category]);
    const filtered = filterHowtoBucket(pool, category as 'food' | 'beauty');
    // mostPopular 풀이 너무 적으면 키워드 검색으로 보강해 다양성을 높인다.
    if (filtered.length < MIN_CATEGORY_RESULTS) {
      const supplemented = await getRawBySearch(country, category as 'food' | 'beauty');
      const merged = new Map<string, YtVideoItem>();
      for (const item of [...filtered, ...supplemented]) {
        if (!merged.has(item.id)) merged.set(item.id, item);
      }
      return Array.from(merged.values());
    }
    return filtered;
  }

  return getRawByCategoryId(country, CATEGORY_TO_YT_ID[category]);
}

export async function getTrendingForCountry(
  country: Exclude<Country, 'global'>,
  category: Category,
): Promise<Video[]> {
  // 공유 캐시(withCache)를 쓰므로 서버리스 콜드 스타트·다중 인스턴스에서도
  // TTL 동안 YouTube API를 다시 부르지 않고, 상류 장애 시 stale 데이터로 버틴다.
  return withCache(`mapped:${country}:${category}`, TRENDING_CACHE_TTL_MS, async () => {
    const rawItems = await getRawItems(country, category);
    const videos = await toVideos(rawItems, country);
    // API 계약: 응답은 항상 조회수 내림차순. ('all'은 getAllPool에서 이미 정렬되지만
    // 개별 카테고리는 YouTube 트렌드 차트 원본 순서라 여기서 통일 정렬해 준다.)
    videos.sort((a, b) => b.viewCount - a.viewCount);
    return videos;
  });
}

export async function getTrending(
  country: Country,
  category: Category,
): Promise<Video[]> {
  if (country !== 'global') {
    return getTrendingForCountry(country, category);
  }

  const [us, jp, kr] = await Promise.all([
    getTrendingForCountry('us', category),
    getTrendingForCountry('jp', category),
    getTrendingForCountry('kr', category),
  ]);

  const merged = new Map<string, Video>();
  for (const v of [...us, ...jp, ...kr]) {
    if (!merged.has(v.id)) merged.set(v.id, v);
  }
  // 3개 국가 목록을 이어붙인 상태라 전역으로는 정렬돼 있지 않다.
  // 진짜 '글로벌 순위'가 되도록 병합 후 조회수 내림차순으로 다시 정렬한다.
  return Array.from(merged.values()).sort((a, b) => b.viewCount - a.viewCount);
}

// 특정 국가의 특정 카테고리 결과가 이 개수 미만이면 글로벌 순위로 대체한다.
// (예: YouTube가 한국의 '교육' mostPopular 차트를 제공하지 않아 결과가 0개인 경우)
const MIN_CATEGORY_RESULTS = 10;

// fallback 이후에도 이 개수 미만이면 프론트에서 "자료가 매우 적음" 경고를 띄운다.
// beauty(~3개), education(0개)처럼 YouTube API 구조상 결과가 극히 적은 카테고리에 대응하기 위해 5로 설정.
const MIN_SCARCE_THRESHOLD = 5;

export interface TrendingResult {
  videos: Video[];
  /** 현지 자료 부족으로 글로벌 순위를 대신 보여줬을 때만 채워진다. */
  fallback: { from: Country; localCount: number } | null;
  /** fallback 이후에도 결과가 MIN_SCARCE_THRESHOLD 미만인 경우 true. */
  tooLittle: boolean;
}

/**
 * 순위를 조회하되, 현지(국가별) 카테고리 자료가 너무 적으면 글로벌 순위로
 * 대체(fallback)해 빈 화면을 막는다. 대체가 일어나면 fallback 정보를 함께 반환해
 * 프론트에서 "자료가 적어 글로벌 순위를 표시한다"는 안내를 띄울 수 있게 한다.
 */
export async function getTrendingWithFallback(
  country: Country,
  category: Category,
): Promise<TrendingResult> {
  const videos = await getTrending(country, category);

  const isSpecificCategory = country !== 'global' && category !== 'all';
  if (isSpecificCategory && videos.length < MIN_CATEGORY_RESULTS) {
    const globalVideos = await getTrending('global', category);
    // 글로벌이 현지보다 실제로 더 많을 때만 대체 (둘 다 비면 대체 의미 없음).
    if (globalVideos.length > videos.length) {
      // 로컬 영상을 앞에 두고, 글로벌에서 로컬에 없는 것으로 나머지를 채운다.
      // 한국 사용자가 food 카테고리를 볼 때 한국 영상이 먼저 노출되도록 한다.
      const localIds = new Set(videos.map((v) => v.id));
      const globalRest = globalVideos.filter((v) => !localIds.has(v.id));
      const merged = [...videos, ...globalRest];
      return {
        videos: merged,
        fallback: { from: country, localCount: videos.length },
        tooLittle: merged.length < MIN_SCARCE_THRESHOLD,
      };
    }
  }

  return {
    videos,
    fallback: null,
    tooLittle: isSpecificCategory && videos.length < MIN_SCARCE_THRESHOLD,
  };
}
