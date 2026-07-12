import type { Video } from '../types/video';

export function searchVideos(videos: Video[], query: string): Video[] {
  const q = query.trim().toLowerCase();
  if (!q) return videos;
  return videos.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.channelName.toLowerCase().includes(q),
  );
}
