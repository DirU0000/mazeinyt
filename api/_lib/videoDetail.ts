import type { VideoDetail } from '../../src/types/video.js';
import { getCache, setCache, TRENDING_CACHE_TTL_MS } from './cache.js';
import {
  fetchChannelSubscribers,
  fetchVideosByIds,
  type YtVideoItem,
} from './youtubeClient.js';

function pickThumbnail(item: YtVideoItem) {
  const t = item.snippet.thumbnails;
  return t.high?.url ?? t.medium?.url ?? t.default?.url ?? '';
}

export async function getVideoDetail(
  videoId: string,
): Promise<VideoDetail | null> {
  const cacheKey = `video:${videoId}`;
  const cached = getCache<VideoDetail>(cacheKey);
  if (cached) return cached;

  const items = await fetchVideosByIds([videoId]);
  const item = items[0];
  if (!item) return null;

  const subMap = await fetchChannelSubscribers([item.snippet.channelId]);
  const subscriberCount = subMap.get(item.snippet.channelId) ?? 0;
  const viewCount = Number(item.statistics.viewCount ?? 0);
  const likeCount = Number(item.statistics.likeCount ?? 0);

  const publishedMs = new Date(item.snippet.publishedAt).getTime();
  const daysSincePublished = Math.max(
    1,
    Math.round((Date.now() - publishedMs) / (24 * 60 * 60 * 1000)),
  );

  const detail: VideoDetail = {
    id: item.id,
    title: item.snippet.title,
    channelId: item.snippet.channelId,
    channelName: item.snippet.channelTitle,
    thumbnailUrl: pickThumbnail(item),
    videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    viewCount,
    likeCount,
    subscriberCount,
    publishedAt: item.snippet.publishedAt,
    daysSincePublished,
    viewsPerDay: Math.round(viewCount / daysSincePublished),
    engagementRate:
      viewCount > 0 ? Math.round((likeCount / viewCount) * 10000) / 100 : 0,
    viralRatio: Math.round((viewCount / Math.max(subscriberCount, 1)) * 100) / 100,
  };

  setCache(cacheKey, detail, TRENDING_CACHE_TTL_MS);
  return detail;
}
