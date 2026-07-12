import type { Category, Country, Video } from '../../src/types/video';
import {
  CATEGORY_TO_YT_ID,
  filterHowtoBucket,
  SHARED_HOWTO_CATEGORIES,
} from './categories';
import { getCache, setCache, TRENDING_CACHE_TTL_MS } from './cache';
import {
  fetchChannelSubscribers,
  fetchMostPopular,
  type YtVideoItem,
} from './youtubeClient';

const REGION_CODE: Record<Exclude<Country, 'global'>, string> = {
  us: 'US',
  jp: 'JP',
  kr: 'KR',
};

// CATEGORY_TO_YT_ID의 중복 제거된 카테고리 id 목록 (26은 food/beauty가 공유).
const DISTINCT_CATEGORY_IDS = Array.from(
  new Set(Object.values(CATEGORY_TO_YT_ID)),
);

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
  } catch {
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

async function getRawItems(
  country: Exclude<Country, 'global'>,
  category: Category,
): Promise<YtVideoItem[]> {
  if (category === 'all') {
    return getAllPool(country);
  }

  if (SHARED_HOWTO_CATEGORIES.includes(category)) {
    const pool = await getRawByCategoryId(country, CATEGORY_TO_YT_ID[category]);
    return filterHowtoBucket(pool, category as 'food' | 'beauty');
  }

  return getRawByCategoryId(country, CATEGORY_TO_YT_ID[category]);
}

export async function getTrendingForCountry(
  country: Exclude<Country, 'global'>,
  category: Category,
): Promise<Video[]> {
  const cacheKey = `mapped:${country}:${category}`;
  const cached = getCache<Video[]>(cacheKey);
  if (cached) return cached;

  const rawItems = await getRawItems(country, category);
  const videos = await toVideos(rawItems, country);
  setCache(cacheKey, videos, TRENDING_CACHE_TTL_MS);
  return videos;
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
  return Array.from(merged.values());
}
