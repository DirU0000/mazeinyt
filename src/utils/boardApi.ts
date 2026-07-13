import type { BoardCategory, BoardPost } from '../types/board';

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export async function fetchPosts(category?: BoardCategory): Promise<BoardPost[]> {
  const q = category ? `?category=${category}` : '';
  const data = await handle<{ posts: BoardPost[] }>(await fetch(`/api/board${q}`));
  return data.posts;
}

export async function fetchPost(id: number): Promise<BoardPost> {
  const data = await handle<{ post: BoardPost }>(await fetch(`/api/board?id=${id}`));
  return data.post;
}

export async function createPost(input: {
  category: BoardCategory;
  nickname: string;
  password: string;
  title: string;
  body: string;
}): Promise<BoardPost> {
  const data = await handle<{ post: BoardPost }>(
    await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
  return data.post;
}

export async function updatePost(
  id: number,
  input: { password: string; title: string; body: string },
): Promise<BoardPost> {
  const data = await handle<{ post: BoardPost }>(
    await fetch(`/api/board?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
  );
  return data.post;
}

export async function deletePost(id: number, password: string): Promise<void> {
  await handle(
    await fetch(`/api/board?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    }),
  );
}
