import { useEffect, useState } from 'react';
import type { Category, Country, Video } from '../types/video';

export function useTrendingVideos(country: Country, category: Category) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/trending?country=${country}&category=${category}`)
      .then((res) => res.json())
      .then((data: { videos?: Video[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setVideos(data.videos ?? []);
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

  return { videos, loading, error };
}
