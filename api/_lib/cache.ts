interface Entry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();

export function getCache<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number) {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export const TRENDING_CACHE_TTL_MS = 10 * 60 * 1000;
// 급상승 채널 랭킹은 채널마다 별도 API 호출(재생목록 조회)이 필요해 계산 비용이
// 훨씬 크므로, 더 긴 주기로 캐싱해 재계산 빈도를 낮춘다.
export const CHANNEL_RANK_CACHE_TTL_MS = 20 * 60 * 1000;
