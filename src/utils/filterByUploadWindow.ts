import type { UploadWindow, Video } from '../types/video';

const WINDOW_MS: Record<UploadWindow, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

export function filterByUploadWindow(
  videos: Video[],
  window: UploadWindow,
): Video[] {
  const cutoff = Date.now() - WINDOW_MS[window];
  return videos.filter((v) => new Date(v.publishedAt).getTime() >= cutoff);
}
