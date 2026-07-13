import { useEffect, useState } from 'react';
import type { ChannelSurge, ChannelSurgeMode, Country } from '../types/video';

export function useChannelSurge(
  country: Country,
  mode: ChannelSurgeMode,
  customRange?: { min: number; max: number },
) {
  const [channels, setChannels] = useState<ChannelSurge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 사용자 지정 구간 모드인데 아직 유효한 범위가 없으면(입력 전 등) 요청하지 않는다.
    if (mode === 'custom' && !customRange) {
      setChannels([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ country, mode });
    if (mode === 'custom' && customRange) {
      params.set('min', String(customRange.min));
      params.set('max', String(customRange.max));
    }

    fetch(`/api/channels?${params.toString()}`)
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
  }, [country, mode, customRange]);

  return { channels, loading, error };
}
