import type { Video, VideoType, VideoTypeFilter } from '../types/video';

/** 이 초 이하는 쇼츠, 초과는 롱폼으로 분류한다. */
export const SHORTS_MAX_SECONDS = 180;

export function getVideoType(durationSeconds: number): VideoType {
  return durationSeconds <= SHORTS_MAX_SECONDS ? 'short' : 'longform';
}

export function filterByVideoType(
  videos: Video[],
  filter: VideoTypeFilter,
): Video[] {
  if (filter === 'all') return videos;
  return videos.filter((v) => getVideoType(v.durationSeconds) === filter);
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
