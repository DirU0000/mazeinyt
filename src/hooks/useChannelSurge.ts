import { useEffect, useState } from 'react';
import type { ChannelSurge, Country } from '../types/video';

export function useChannelSurge(country: Country) {
  const [channels, setChannels] = useState<ChannelSurge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/channels?country=${country}`)
      .then((res) => res.json())
      .then((data: { channels?: ChannelSurge[]; error?: string }) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setChannels(data.channels ?? []);
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
  }, [country]);

  return { channels, loading, error };
}
