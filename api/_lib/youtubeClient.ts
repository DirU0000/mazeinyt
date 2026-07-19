const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YtVideoItem {
  id: string;
  snippet: {
    title: string;
    channelId: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
  };
  contentDetails: {
    /** ISO 8601 duration (예: "PT3M25S"). */
    duration: string;
  };
}

/** ISO 8601 duration("PT1H2M3S" 등)을 초로 변환한다. 형식이 이상하면 0을 반환한다. */
export function parseIsoDurationToSeconds(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

interface YtVideosListResponse {
  items: YtVideoItem[];
  nextPageToken?: string;
}

interface YtChannelItem {
  id: string;
  statistics: {
    subscriberCount?: string;
  };
}

interface YtChannelsListResponse {
  items: YtChannelItem[];
}

interface YtChannelContentDetailsItem {
  id: string;
  contentDetails: {
    relatedPlaylists: {
      uploads?: string;
    };
  };
}

interface YtChannelsContentDetailsResponse {
  items: YtChannelContentDetailsItem[];
}

interface YtPlaylistItem {
  contentDetails: {
    videoId: string;
  };
}

interface YtPlaylistItemsResponse {
  items: YtPlaylistItem[];
}

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    throw new Error('YOUTUBE_API_KEY 환경변수가 설정되어 있지 않습니다.');
  }
  return key;
}

async function ytFetch<T>(path: string, params: Record<string, string>) {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('key', apiKey());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API 오류 (${res.status}): ${body}`);
  }
  return (await res.json()) as T;
}

/** chart=mostPopular 트렌드 영상을 최대 100개(2페이지)까지 가져온다. */
export async function fetchMostPopular(
  regionCode: string,
  videoCategoryId?: string,
) {
  const items: YtVideoItem[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < 2; page++) {
    const params: Record<string, string> = {
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode,
      maxResults: '50',
    };
    if (videoCategoryId) params.videoCategoryId = videoCategoryId;
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch<YtVideosListResponse>('/videos', params);
    items.push(...data.items);
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return items;
}

interface YtSearchVideoItem {
  id: { videoId: string };
}

interface YtSearchResponse {
  items: YtSearchVideoItem[];
}

/**
 * 키워드 검색으로 인기 동영상 ID를 가져온 뒤 상세 정보를 반환한다.
 * quota: search.list 100 + videos.list 1 = 101 units/call.
 */
export async function fetchSearch(
  regionCode: string,
  q: string,
  maxResults = 15,
): Promise<YtVideoItem[]> {
  const data = await ytFetch<YtSearchResponse>('/search', {
    part: 'id',
    type: 'video',
    regionCode,
    q,
    order: 'viewCount',
    maxResults: String(maxResults),
  });
  const ids = data.items.map((i) => i.id.videoId).filter(Boolean);
  return fetchVideosByIds(ids);
}

/** 영상 ID로 단건(또는 소수) 조회. 존재하지 않으면 빈 배열. */
export async function fetchVideosByIds(ids: string[]): Promise<YtVideoItem[]> {
  if (ids.length === 0) return [];
  const data = await ytFetch<YtVideosListResponse>('/videos', {
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
  });
  return data.items;
}

/** 채널 ID 배열(최대 50개씩 배치)로 구독자 수를 조회한다. */
export async function fetchChannelSubscribers(channelIds: string[]) {
  const result = new Map<string, number>();
  const unique = Array.from(new Set(channelIds));

  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await ytFetch<YtChannelsListResponse>('/channels', {
      part: 'statistics',
      id: batch.join(','),
    });
    for (const ch of data.items) {
      result.set(ch.id, Number(ch.statistics.subscriberCount ?? 0));
    }
  }

  return result;
}

/** 채널 ID 배열(최대 50개씩 배치)로 '업로드' 재생목록 ID를 조회한다. */
export async function fetchUploadsPlaylistIds(channelIds: string[]) {
  const result = new Map<string, string>();
  const unique = Array.from(new Set(channelIds));

  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50);
    const data = await ytFetch<YtChannelsContentDetailsResponse>('/channels', {
      part: 'contentDetails',
      id: batch.join(','),
    });
    for (const ch of data.items) {
      const uploads = ch.contentDetails.relatedPlaylists.uploads;
      if (uploads) result.set(ch.id, uploads);
    }
  }

  return result;
}

/**
 * 채널의 '업로드' 재생목록에서 가장 최근 영상 ID를 가져온다.
 * (업로드 재생목록은 기본적으로 최신순으로 정렬되어 있다.)
 */
export async function fetchRecentVideoIds(playlistId: string, maxResults: number) {
  try {
    const data = await ytFetch<YtPlaylistItemsResponse>('/playlistItems', {
      part: 'contentDetails',
      playlistId,
      maxResults: String(maxResults),
    });
    return data.items.map((item) => item.contentDetails.videoId);
  } catch {
    // 비공개/삭제된 업로드 재생목록 등은 빈 배열로 처리한다.
    return [];
  }
}

export type { YtVideoItem };
