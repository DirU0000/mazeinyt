import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Country } from '../src/types/video.js';
import { getChannelSurge } from './_lib/channels.js';

const VALID_COUNTRIES: Country[] = ['global', 'us', 'jp', 'kr'];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const country = first(req.query.country) ?? 'global';

  if (!VALID_COUNTRIES.includes(country as Country)) {
    res.status(400).json({ error: `invalid country: ${country}` });
    return;
  }

  try {
    const channels = await getChannelSurge(country as Country);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json({ channels });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
