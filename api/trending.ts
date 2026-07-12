import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Category, Country } from '../src/types/video.js';
import { getTrending } from './_lib/trending.js';

const VALID_COUNTRIES: Country[] = ['global', 'us', 'jp', 'kr'];
const VALID_CATEGORIES: Category[] = [
  'all',
  'animal',
  'game',
  'music',
  'sports',
  'food',
  'education',
  'beauty',
  'comedy',
];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const country = first(req.query.country) ?? 'global';
  const category = first(req.query.category) ?? 'all';

  if (!VALID_COUNTRIES.includes(country as Country)) {
    res.status(400).json({ error: `invalid country: ${country}` });
    return;
  }
  if (!VALID_CATEGORIES.includes(category as Category)) {
    res.status(400).json({ error: `invalid category: ${category}` });
    return;
  }

  try {
    const videos = await getTrending(country as Country, category as Category);
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    res.status(200).json({ videos });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
