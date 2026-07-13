import type { BoardCategory, BoardPost } from '../../src/types/board.js';
import { hashPassword, sbFetch, verifyPassword } from './supabase.js';

const VALID_CATEGORIES: BoardCategory[] = ['info', 'suggestion'];

// DB row(snake_case, password_hash 포함) → 클라이언트용 BoardPost 매핑.
interface PostRow {
  id: number;
  category: BoardCategory;
  nickname: string;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

// password_hash를 select에서 아예 제외해 클라이언트로 새어나가지 않게 한다.
const PUBLIC_COLUMNS = 'id,category,nickname,title,body,created_at,updated_at';

function toPost(row: PostRow): BoardPost {
  return {
    id: row.id,
    category: row.category,
    nickname: row.nickname,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function trimmed(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export class BoardError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function listPosts(category?: string): Promise<BoardPost[]> {
  let path = `/posts?select=${PUBLIC_COLUMNS}&order=created_at.desc&limit=100`;
  if (category && VALID_CATEGORIES.includes(category as BoardCategory)) {
    path += `&category=eq.${category}`;
  }
  const rows = await sbFetch<PostRow[]>(path);
  return rows.map(toPost);
}

export async function getPost(id: number): Promise<BoardPost | null> {
  const rows = await sbFetch<PostRow[]>(
    `/posts?select=${PUBLIC_COLUMNS}&id=eq.${id}&limit=1`,
  );
  return rows[0] ? toPost(rows[0]) : null;
}

export async function createPost(input: {
  category: unknown;
  nickname: unknown;
  password: unknown;
  title: unknown;
  body: unknown;
}): Promise<BoardPost> {
  const category = trimmed(input.category) || 'info';
  const nickname = trimmed(input.nickname);
  const password = typeof input.password === 'string' ? input.password : '';
  const title = trimmed(input.title);
  const body = trimmed(input.body);

  if (!VALID_CATEGORIES.includes(category as BoardCategory)) {
    throw new BoardError(400, 'invalid category');
  }
  if (nickname.length < 1 || nickname.length > 20) {
    throw new BoardError(400, 'nickname must be 1-20 characters');
  }
  if (password.length < 4) {
    throw new BoardError(400, 'password must be at least 4 characters');
  }
  if (title.length < 1 || title.length > 100) {
    throw new BoardError(400, 'title must be 1-100 characters');
  }
  if (body.length < 1 || body.length > 5000) {
    throw new BoardError(400, 'body must be 1-5000 characters');
  }

  const rows = await sbFetch<PostRow[]>('/posts', {
    method: 'POST',
    returnRepresentation: true,
    body: JSON.stringify({
      category,
      nickname,
      password_hash: hashPassword(password),
      title,
      body,
    }),
  });
  return toPost(rows[0]);
}

/** 수정/삭제 전 비밀번호를 검증한다. 실패 시 BoardError를 던진다. */
async function assertPassword(id: number, password: unknown): Promise<void> {
  if (typeof password !== 'string' || password.length === 0) {
    throw new BoardError(400, 'password required');
  }
  const rows = await sbFetch<{ password_hash: string }[]>(
    `/posts?select=password_hash&id=eq.${id}&limit=1`,
  );
  if (!rows[0]) throw new BoardError(404, 'post not found');
  if (!verifyPassword(password, rows[0].password_hash)) {
    throw new BoardError(403, 'wrong password');
  }
}

export async function updatePost(
  id: number,
  input: { password: unknown; title: unknown; body: unknown },
): Promise<BoardPost> {
  await assertPassword(id, input.password);

  const title = trimmed(input.title);
  const body = trimmed(input.body);
  if (title.length < 1 || title.length > 100) {
    throw new BoardError(400, 'title must be 1-100 characters');
  }
  if (body.length < 1 || body.length > 5000) {
    throw new BoardError(400, 'body must be 1-5000 characters');
  }

  const rows = await sbFetch<PostRow[]>(`/posts?id=eq.${id}`, {
    method: 'PATCH',
    returnRepresentation: true,
    body: JSON.stringify({ title, body, updated_at: new Date().toISOString() }),
  });
  return toPost(rows[0]);
}

export async function deletePost(
  id: number,
  password: unknown,
): Promise<void> {
  await assertPassword(id, password);
  await sbFetch(`/posts?id=eq.${id}`, { method: 'DELETE' });
}
