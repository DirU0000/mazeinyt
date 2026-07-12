import type { ChannelSurge, Country } from '../../src/types/video';
import { getTrending } from './trending';

// 구독자 수가 이보다 적은(또는 숨김=0) 채널은 비율이 불안정해 제외한다.
const MIN_SUBSCRIBERS = 1000;

/**
 * "구독자 대비 조회수 폭발" 기준 급상승 채널 순위.
 *
 * 유튜브 API는 실시간 구독자 증가율을 주지 않으므로, 트렌드에 오른 영상들의 조회수 합이
 * 그 채널의 구독자 수를 얼마나 웃도는지(ratio)를 급상승 정도의 근사치로 사용한다.
 * 작은 채널이 큰 조회수를 낼수록 순위가 높아진다 — 실제 구독 증가와 완전히 같진 않지만
 * 급성장 중인 채널과 강하게 상관된다.
 */
export async function getChannelSurge(country: Country): Promise<ChannelSurge[]> {
  const videos = await getTrending(country, 'all');

  const byChannel = new Map<
    string,
    { name: string; subs: number; views: number; count: number }
  >();

  for (const v of videos) {
    if (v.subscriberCount < MIN_SUBSCRIBERS) continue;
    const entry = byChannel.get(v.channelId);
    if (entry) {
      entry.views += v.viewCount;
      entry.count += 1;
    } else {
      byChannel.set(v.channelId, {
        name: v.channelName,
        subs: v.subscriberCount,
        views: v.viewCount,
        count: 1,
      });
    }
  }

  const ranked: ChannelSurge[] = Array.from(byChannel.entries()).map(
    ([channelId, e]) => ({
      channelId,
      channelName: e.name,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      subscriberCount: e.subs,
      trendingViews: e.views,
      videoCount: e.count,
      ratio: e.views / e.subs,
    }),
  );

  return ranked.sort((a, b) => b.ratio - a.ratio).slice(0, 15);
}
