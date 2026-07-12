import type { SortOption, Video } from '../types/video';

function viralRatio(v: Video) {
  return v.viewCount / Math.max(v.subscriberCount, 1);
}

export function sortVideos(videos: Video[], sort: SortOption): Video[] {
  const list = [...videos];
  if (sort === 'views-desc') list.sort((a, b) => b.viewCount - a.viewCount);
  else if (sort === 'views-asc') list.sort((a, b) => a.viewCount - b.viewCount);
  else list.sort((a, b) => viralRatio(b) - viralRatio(a));
  return list;
}
