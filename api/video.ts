import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getVideoDetail } from './_lib/videoDetail';

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = first(req.query.id);

  if (!id) {
    res.status(400).json({ error: 'missing id' });
    return;
  }

  try {
    const video = await getVideoDetail(id);
    if (!video) {
      res.status(404).json({ error: 'video not found' });
      return;
    }
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json({ video });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
