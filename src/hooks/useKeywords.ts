import { useEffect, useState } from 'react';
import type { KeywordsByCountry } from '../types/keyword';

export function useKeywords() {
  const [data, setData] = useState<KeywordsByCountry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/keywords')
      .then((res) => res.json())
      .then((json: KeywordsByCountry & { error?: string }) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setData(json);
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
  }, []);

  return { data, loading, error };
}
