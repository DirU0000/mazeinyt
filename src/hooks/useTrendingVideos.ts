import { useEffect, useState } from 'react';
import type { Category, Country, Video } from '../types/video';

/** 현지 자료 부족으로 글로벌 순위를 대신 보여줬을 때만 채워진다. */
export interface TrendingFallback {
  from: Country;
  localCount: number;
}

interface TrendingResponse {
  videos?: Video[];
  fallback?: TrendingFallback | null;
  error?: string;
}

export function useTrendingVideos(country: Country, category: Category) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [fallback, setFallback] = useState<TrendingFallback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/trending?country=${country}&category=${category}`)
      .then((res) => res.json())
      .then((data: TrendingResponse) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setVideos(data.videos ?? []);
        setFallback(data.fallback ?? null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [country, category]);

  return { videos, fallback, loading, error };
}
