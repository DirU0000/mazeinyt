import { useCallback, useEffect, useState } from 'react';
import type { BoardCategory, BoardPost } from '../types/board';
import { fetchPost, fetchPosts } from '../utils/boardApi';

export function useBoardList(category?: BoardCategory) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPosts(category)
      .then((data) => {
        if (!cancelled) setPosts(data);
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
  }, [category]);

  useEffect(() => reload(), [reload]);

  return { posts, loading, error, reload };
}

export function useBoardPost(id: number | undefined) {
  const [post, setPost] = useState<BoardPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined || Number.isNaN(id)) {
      setError('invalid id');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchPost(id)
      .then((data) => {
        if (!cancelled) setPost(data);
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

  return { post, loading, error };
}
