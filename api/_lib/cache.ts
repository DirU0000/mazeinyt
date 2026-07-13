import { sbFetch } from './supabase.js';

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

export const TRENDING_CACHE_TTL_MS = 20 * 60 * 1000;
// 급상승 채널 랭킹은 채널마다 별도 API 호출(재생목록 조회)이 필요해 계산 비용이
// 훨씬 크므로, 더 긴 주기로 캐싱해 재계산 빈도를 낮춘다. (YouTube API 일일
// 할당량 10,000유닛 소진 사고 후 20분 → 60분으로 연장)
export const CHANNEL_RANK_CACHE_TTL_MS = 60 * 60 * 1000;

// --- L2 공유 캐시 (Supabase api_cache 테이블) ---
// 서버리스 함수는 인스턴스마다 메모리가 분리되고 콜드 스타트로 수시로 비워지므로,
// 메모리 캐시(L1)만으로는 YouTube API 재호출을 막지 못한다. 비싼 계산 결과를
// Supabase에 함께 저장해(L2) 모든 인스턴스가 공유한다.
// Supabase 미설정·테이블 없음 등의 상황에서도 사이트가 죽지 않도록
// 공유 캐시 접근 실패는 전부 조용히 무시하고 L1/직접 계산으로 폴백한다.

interface SharedRow {
  data: unknown;
  expires_at: string;
}

async function readShared<T>(
  key: string,
  allowStale: boolean,
): Promise<T | undefined> {
  try {
    const rows = await sbFetch<SharedRow[]>(
      `/api_cache?select=data,expires_at&key=eq.${encodeURIComponent(key)}&limit=1`,
    );
    const row = rows[0];
    if (!row) return undefined;
    if (!allowStale && Date.now() > new Date(row.expires_at).getTime()) {
      return undefined;
    }
    return row.data as T;
  } catch {
    return undefined;
  }
}

async function writeShared(key: string, data: unknown, ttlMs: number) {
  try {
    await sbFetch('/api_cache?on_conflict=key', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        key,
        data,
        expires_at: new Date(Date.now() + ttlMs).toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // 캐시 저장은 최선 노력. 실패해도 본 응답에는 영향 없음.
  }
}

/**
 * 2단 캐시 + stale 폴백 래퍼.
 * 1) 메모리(L1) 히트 → 즉시 반환
 * 2) Supabase(L2) 유효 캐시 히트 → 메모리에 올리고 반환
 * 3) compute() 실행 → 양쪽 캐시에 저장
 * 4) compute() 실패(YouTube 할당량 초과 등) → 만료됐더라도 L2의 마지막
 *    성공 데이터를 반환해 사이트가 빈 화면이 되지 않게 한다.
 */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  compute: () => Promise<T>,
): Promise<T> {
  const mem = getCache<T>(key);
  if (mem !== undefined) return mem;

  const shared = await readShared<T>(key, false);
  if (shared !== undefined) {
    setCache(key, shared, ttlMs);
    return shared;
  }

  try {
    const fresh = await compute();
    setCache(key, fresh, ttlMs);
    await writeShared(key, fresh, ttlMs);
    return fresh;
  } catch (err) {
    const stale = await readShared<T>(key, true);
    if (stale !== undefined) return stale;
    throw err;
  }
}
