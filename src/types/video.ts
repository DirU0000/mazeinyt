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

export type ChannelSurgeMode = 'segmented' | 'continuous';

export interface ChannelSurge {
  channelId: string;
  channelName: string;
  channelUrl: string;
  subscriberCount: number;
  /** 가장 최근에 업로드된 영상 최대 3개의 평균 조회수. */
  recentAvgViews: number;
  /** 비교 대상(같은 구독자 구간, 또는 구독자 수가 비슷한 채널들)의 평균 조회수. */
  peerAverageViews: number;
  /** recentAvgViews - peerAverageViews. 이 값 기준으로 정렬된다. */
  diff: number;
  /** recentAvgViews / peerAverageViews. 화면 표시용. */
  ratio: number;
  /** 'segmented' 모드에서만 채워지는 구독자 구간 경계 (언어별 표기는 클라이언트에서 포맷). */
  tierMin?: number;
  tierMax?: number | null;
}
