import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ChannelSurgeMode, Country } from '../src/types/video.js';
import { getChannelRanking } from './_lib/channels.js';

const VALID_COUNTRIES: Country[] = ['global', 'us', 'jp', 'kr'];
const VALID_MODES: ChannelSurgeMode[] = ['segmented', 'continuous'];

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const country = first(req.query.country) ?? 'global';
  const mode = first(req.query.mode) ?? 'segmented';

  if (!VALID_COUNTRIES.includes(country as Country)) {
    res.status(400).json({ error: `invalid country: ${country}` });
    return;
  }
  if (!VALID_MODES.includes(mode as ChannelSurgeMode)) {
    res.status(400).json({ error: `invalid mode: ${mode}` });
    return;
  }

  try {
    const channels = await getChannelRanking(
      country as Country,
      mode as ChannelSurgeMode,
    );
    // 채널당 추가 API 호출이 필요해 계산 비용이 크므로, 트렌드 데이터보다 긴
    // 캐시 주기를 둔다 (api/_lib/cache.ts의 CHANNEL_RANK_CACHE_TTL_MS와 맞춤).
    res.setHeader('Cache-Control', 's-maxage=1200, stale-while-revalidate');
    res.status(200).json({ channels });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
