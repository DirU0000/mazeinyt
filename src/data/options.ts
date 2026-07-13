import type {
  Category,
  ChannelSurgeMode,
  Country,
  SortOption,
  UploadWindow,
  VideoTypeFilter,
} from '../types/video';

export const countryOptions: { value: Country; labelKey: string }[] = [
  { value: 'global', labelKey: 'country.global' },
  { value: 'us', labelKey: 'country.us' },
  { value: 'jp', labelKey: 'country.jp' },
  { value: 'kr', labelKey: 'country.kr' },
];

export const channelModeOptions: { value: ChannelSurgeMode; labelKey: string }[] = [
  { value: 'continuous', labelKey: 'channelMode.continuous' },
  { value: 'segmented', labelKey: 'channelMode.segmented' },
  { value: 'custom', labelKey: 'channelMode.custom' },
];

export const categoryOptions: { value: Category; labelKey: string }[] = [
  { value: 'all', labelKey: 'category.all' },
  { value: 'animal', labelKey: 'category.animal' },
  { value: 'game', labelKey: 'category.game' },
  { value: 'music', labelKey: 'category.music' },
  { value: 'sports', labelKey: 'category.sports' },
  { value: 'food', labelKey: 'category.food' },
  { value: 'beauty', labelKey: 'category.beauty' },
  { value: 'comedy', labelKey: 'category.comedy' },
];

export const sortOptions: { value: SortOption; labelKey: string }[] = [
  { value: 'views-desc', labelKey: 'sort.viewsDesc' },
  { value: 'views-asc', labelKey: 'sort.viewsAsc' },
  { value: 'viral-ratio', labelKey: 'sort.viral' },
];

export const uploadWindowOptions: { value: UploadWindow; labelKey: string }[] = [
  { value: 'day', labelKey: 'period.day' },
  { value: 'week', labelKey: 'period.week' },
  { value: 'month', labelKey: 'period.month' },
  { value: 'year', labelKey: 'period.year' },
];

export const videoTypeOptions: { value: VideoTypeFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'videoType.all' },
  { value: 'short', labelKey: 'videoType.short' },
  { value: 'longform', labelKey: 'videoType.longform' },
];

/** value → 번역 키 매핑 (배지 등 옵션 목록 밖에서 라벨이 필요할 때). */
export const countryLabelKey: Record<Country, string> = Object.fromEntries(
  countryOptions.map((o) => [o.value, o.labelKey]),
) as Record<Country, string>;
