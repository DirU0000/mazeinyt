import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getKeywordsForCountry } from './_lib/keywords.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [us, jp, kr] = await Promise.all([
      getKeywordsForCountry('us'),
      getKeywordsForCountry('jp'),
      getKeywordsForCountry('kr'),
    ]);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json({ us, jp, kr });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
