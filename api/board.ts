import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  BoardError,
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from './_lib/board.js';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const idParam = first(req.query.id);
    const id = idParam ? Number(idParam) : undefined;

    if (req.method === 'GET') {
      if (id !== undefined) {
        const post = await getPost(id);
        if (!post) {
          res.status(404).json({ error: 'post not found' });
          return;
        }
        res.status(200).json({ post });
        return;
      }
      const posts = await listPosts(first(req.query.category));
      res.status(200).json({ posts });
      return;
    }

    if (req.method === 'POST') {
      const post = await createPost(req.body ?? {});
      res.status(201).json({ post });
      return;
    }

    if (req.method === 'PATCH') {
      if (id === undefined || Number.isNaN(id)) {
        res.status(400).json({ error: 'id required' });
        return;
      }
      const post = await updatePost(id, req.body ?? {});
      res.status(200).json({ post });
      return;
    }

    if (req.method === 'DELETE') {
      if (id === undefined || Number.isNaN(id)) {
        res.status(400).json({ error: 'id required' });
        return;
      }
      await deletePost(id, (req.body ?? {}).password);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    if (err instanceof BoardError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: (err as Error).message });
  }
}
