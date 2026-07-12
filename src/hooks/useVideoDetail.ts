import { useEffect, useState } from 'react';
import type { VideoDetail } from '../types/video';

export function useVideoDetail(id: string | undefined) {
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    fetch(`/api/video?id=${encodeURIComponent(id)}`)
      .then(async (res) => {
        const data: { video?: VideoDetail; error?: string } = await res.json();
        if (cancelled) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (data.error) throw new Error(data.error);
        setVideo(data.video ?? null);
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
  }, [id]);

  return { video, loading, error, notFound };
}
