import type {
  ChannelSurge,
  ChannelSurgeMode,
  Country,
} from '../../src/types/video.js';
import { CHANNEL_RANK_CACHE_TTL_MS, getCache, setCache } from './cache.js';
import { getTrending } from './trending.js';
import {
  fetchRecentVideoIds,
  fetchUploadsPlaylistIds,
  fetchVideosByIds,
} from './youtubeClient.js';

// 구독자 수가 이보다 적은(또는 숨김=0) 채널은 비율이 불안정해 제외한다.
const MIN_SUBSCRIBERS = 1000;
// 채널당 재생목록 조회가 추가로 필요해 비용이 크므로, 후보를 상위 N개로 제한해
// 응답 시간을 예측 가능한 범위로 묶는다. getTrending()은 이미 조회수 내림차순이라
// 상위 N개는 자연스럽게 "트렌드에서 실제로 존재감 있는" 채널 위주가 된다.
const MAX_CANDIDATES = 120;
// 채널 하나당 최근 업로드 영상을 최대 이만큼 본다.
const RECENT_VIDEOS_PER_CHANNEL = 3;
// playlistItems.list는 채널당 1회씩 호출해야 하므로 동시 요청 수를 제한해
// 응답 지연·순간 부하를 관리한다.
const FETCH_CONCURRENCY = 40;

// 고정 구간(로그 스케일). 각 채널은 자신의 구독자 수가 속한 구간의 평균과 비교된다.
const SUBSCRIBER_TIERS: { min: number; max: number | null }[] = [
  { min: 1_000, max: 10_000 },
  { min: 10_000, max: 100_000 },
  { min: 100_000, max: 1_000_000 },
  { min: 1_000_000, max: 10_000_000 },
  { min: 10_000_000, max: null },
];

// '전체 구간' 모드에서 또래 채널로 볼 구독자 수 범위 (로그 거리 기준, 약 0.5배~2배).
const CONTINUOUS_LOG_WINDOW = 0.3;
const CONTINUOUS_MIN_PEERS = 3;

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return results;
}

interface Candidate {
  channelId: string;
  channelName: string;
  subscriberCount: number;
}

/** 트렌드 풀(조회수 내림차순)에서 중복 제거된 상위 채널 후보를 뽑는다. */
async function getCandidateChannels(country: Country): Promise<Candidate[]> {
  const videos = await getTrending(country, 'all');
  const seen = new Set<string>();
  const candidates: Candidate[] = [];

  for (const v of videos) {
    if (v.subscriberCount < MIN_SUBSCRIBERS) continue;
    if (seen.has(v.channelId)) continue;
    seen.add(v.channelId);
    candidates.push({
      channelId: v.channelId,
      channelName: v.channelName,
      subscriberCount: v.subscriberCount,
    });
    if (candidates.length >= MAX_CANDIDATES) break;
  }

  return candidates;
}

const UPLOADS_PLAYLIST_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 거의 안 바뀌는 값이라 길게 캐싱

/** 채널의 업로드 재생목록 ID를 채널별로 캐싱하며 조회한다. */
async function getUploadsPlaylistIdsCached(
  channelIds: string[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const missing: string[] = [];

  for (const id of channelIds) {
    const cached = getCache<string>(`uploadsPlaylist:${id}`);
    if (cached) result.set(id, cached);
    else missing.push(id);
  }

  if (missing.length > 0) {
    const fetched = await fetchUploadsPlaylistIds(missing);
    for (const [channelId, playlistId] of fetched) {
      result.set(channelId, playlistId);
      setCache(`uploadsPlaylist:${channelId}`, playlistId, UPLOADS_PLAYLIST_CACHE_TTL_MS);
    }
  }

  return result;
}

interface ChannelStat {
  channelId: string;
  channelName: string;
  subscriberCount: number;
  recentAvgViews: number;
}

/** 후보 채널들의 "최근 업로드 N개 평균 조회수"를 계산한다. */
async function getRecentAvgViewsStats(
  candidates: Candidate[],
): Promise<ChannelStat[]> {
  const uploadsPlaylistMap = await getUploadsPlaylistIdsCached(
    candidates.map((c) => c.channelId),
  );

  const recentIdsByChannel = new Map<string, string[]>();
  await mapWithConcurrency(candidates, FETCH_CONCURRENCY, async (c) => {
    const playlistId = uploadsPlaylistMap.get(c.channelId);
    if (!playlistId) return;
    const ids = await fetchRecentVideoIds(playlistId, RECENT_VIDEOS_PER_CHANNEL);
    recentIdsByChannel.set(c.channelId, ids);
  });

  const allVideoIds = Array.from(recentIdsByChannel.values()).flat();
  const viewCountMap = new Map<string, number>();
  for (let i = 0; i < allVideoIds.length; i += 50) {
    const batch = allVideoIds.slice(i, i + 50);
    const items = await fetchVideosByIds(batch);
    for (const item of items) {
      viewCountMap.set(item.id, Number(item.statistics.viewCount ?? 0));
    }
  }

  const stats: ChannelStat[] = [];
  for (const c of candidates) {
    const ids = recentIdsByChannel.get(c.channelId) ?? [];
    const views = ids
      .filter((id) => viewCountMap.has(id))
      .map((id) => viewCountMap.get(id)!);
    if (views.length === 0) continue;
    const avg = views.reduce((a, b) => a + b, 0) / views.length;
    stats.push({
      channelId: c.channelId,
      channelName: c.channelName,
      subscriberCount: c.subscriberCount,
      recentAvgViews: avg,
    });
  }

  return stats;
}

function toChannelSurge(
  s: ChannelStat,
  peerAverageViews: number,
  tier?: { min: number; max: number | null },
): ChannelSurge {
  const safePeerAvg = Math.max(peerAverageViews, 1);
  return {
    channelId: s.channelId,
    channelName: s.channelName,
    channelUrl: `https://www.youtube.com/channel/${s.channelId}`,
    subscriberCount: s.subscriberCount,
    recentAvgViews: s.recentAvgViews,
    peerAverageViews,
    diff: s.recentAvgViews - peerAverageViews,
    ratio: s.recentAvgViews / safePeerAvg,
    ...(tier ? { tierMin: tier.min, tierMax: tier.max } : {}),
  };
}

/** '고정 구간' 모드: 로그 스케일 구간별로 그룹화해 구간 평균과 비교한다. */
function rankSegmented(stats: ChannelStat[]): ChannelSurge[] {
  const tierOf = (subs: number) =>
    SUBSCRIBER_TIERS.find((t) => subs >= t.min && (t.max === null || subs < t.max)) ??
    SUBSCRIBER_TIERS[SUBSCRIBER_TIERS.length - 1];

  const byTier = new Map<number, ChannelStat[]>();
  for (const s of stats) {
    const tierIndex = SUBSCRIBER_TIERS.indexOf(tierOf(s.subscriberCount));
    const group = byTier.get(tierIndex) ?? [];
    group.push(s);
    byTier.set(tierIndex, group);
  }

  const ranked: ChannelSurge[] = [];
  for (const [tierIndex, group] of byTier) {
    const tier = SUBSCRIBER_TIERS[tierIndex];
    const avg = group.reduce((a, b) => a + b.recentAvgViews, 0) / group.length;
    for (const s of group) {
      ranked.push(toChannelSurge(s, avg, tier));
    }
  }

  return ranked.sort((a, b) => b.diff - a.diff);
}

/** '전체 구간' 모드: 고정 구간 없이, 구독자 수가 로그 거리 기준으로 가까운 채널들과 비교한다. */
function rankContinuous(stats: ChannelStat[]): ChannelSurge[] {
  const withLog = stats.map((s) => ({ ...s, log: Math.log10(s.subscriberCount) }));

  const ranked: ChannelSurge[] = [];
  for (const s of withLog) {
    let window = CONTINUOUS_LOG_WINDOW;
    let peers: typeof withLog = [];
    // 후보가 적은 구간에서는 비교 대상이 너무 적을 수 있으므로 창을 점진적으로 넓힌다.
    for (let attempt = 0; attempt < 5; attempt++) {
      peers = withLog.filter(
        (p) => p.channelId !== s.channelId && Math.abs(p.log - s.log) <= window,
      );
      if (peers.length >= CONTINUOUS_MIN_PEERS) break;
      window *= 2;
    }
    if (peers.length === 0) continue;

    const avg = peers.reduce((a, b) => a + b.recentAvgViews, 0) / peers.length;
    ranked.push(toChannelSurge(s, avg));
  }

  return ranked.sort((a, b) => b.diff - a.diff);
}

const RESULT_LIMIT = 15;

/**
 * "최근 업로드 N개 평균 조회수" 계산은 채널당 API 호출이 필요해 비용이 크다.
 * segmented/continuous 두 모드가 이 원본 통계를 공유하도록 모드와 무관하게
 * 국가 단위로 캐싱해, 같은 국가의 다른 모드를 요청해도 재계산하지 않는다.
 */
async function getRecentAvgViewsStatsCached(country: Country): Promise<ChannelStat[]> {
  const cacheKey = `channelStats:${country}`;
  const cached = getCache<ChannelStat[]>(cacheKey);
  if (cached) return cached;

  const candidates = await getCandidateChannels(country);
  const stats = await getRecentAvgViewsStats(candidates);
  setCache(cacheKey, stats, CHANNEL_RANK_CACHE_TTL_MS);
  return stats;
}

export async function getChannelRanking(
  country: Country,
  mode: ChannelSurgeMode,
): Promise<ChannelSurge[]> {
  const cacheKey = `channelRank:${country}:${mode}`;
  const cached = getCache<ChannelSurge[]>(cacheKey);
  if (cached) return cached;

  const stats = await getRecentAvgViewsStatsCached(country);
  const ranked =
    mode === 'segmented' ? rankSegmented(stats) : rankContinuous(stats);
  const result = ranked.slice(0, RESULT_LIMIT);

  setCache(cacheKey, result, CHANNEL_RANK_CACHE_TTL_MS);
  return result;
}
