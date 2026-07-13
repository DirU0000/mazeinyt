import { useEffect, useState } from 'react';
import type { ChannelSurge, ChannelSurgeMode, Country } from '../types/video';

export function useChannelSurge(country: Country, mode: ChannelSurgeMode) {
  const [channels, setChannels] = useState<ChannelSurge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/channels?country=${country}&mode=${mode}`)
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
  }, [country, mode]);

  return { channels, loading, error };
}
