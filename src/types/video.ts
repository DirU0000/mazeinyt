export type Country = 'global' | 'us' | 'jp' | 'kr';

export type Category =
  | 'all'
  | 'animal'
  | 'game'
  | 'music'
  | 'sports'
  | 'food'
  | 'education'
  | 'beauty'
  | 'comedy';

export type SortOption = 'views-desc' | 'views-asc' | 'viral-ratio';

export type UploadWindow = 'day' | 'week' | 'month' | 'year';

export interface Video {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  videoUrl: string;
  country: Exclude<Country, 'global'>;
  viewCount: number;
  likeCount: number;
  subscriberCount: number;
  publishedAt: string;
}

export interface VideoDetail {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  videoUrl: string;
  viewCount: number;
  likeCount: number;
  subscriberCount: number;
  publishedAt: string;
  daysSincePublished: number;
  viewsPerDay: number;
  engagementRate: number;
  viralRatio: number;
}

export interface ChannelSurge {
  channelId: string;
  channelName: string;
  channelUrl: string;
  subscriberCount: number;
  trendingViews: number;
  videoCount: number;
  ratio: number;
}
