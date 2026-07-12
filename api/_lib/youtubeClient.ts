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
      part: 'snippet,statistics',
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

/** 영상 ID로 단건(또는 소수) 조회. 존재하지 않으면 빈 배열. */
export async function fetchVideosByIds(ids: string[]): Promise<YtVideoItem[]> {
  if (ids.length === 0) return [];
  const data = await ytFetch<YtVideosListResponse>('/videos', {
    part: 'snippet,statistics',
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

export type { YtVideoItem };
