import type { Category } from '../../src/types/video.js';

/**
 * YouTube 공식 videoCategoryId 매핑.
 * YouTube에는 '먹방·요리'/'뷰티' 전용 카테고리가 없어 둘 다 26(Howto & Style)을
 * 공유하고, 이후 제목 키워드로 걸러낸다 (완벽히 분리되진 않음 — 알려진 한계).
 */
export const CATEGORY_TO_YT_ID: Record<Exclude<Category, 'all'>, string> = {
  animal: '15',
  game: '20',
  music: '10',
  sports: '17',
  food: '26',
  beauty: '26',
  education: '27',
  comedy: '23',
};

export const SHARED_HOWTO_CATEGORIES: Exclude<Category, 'all'>[] = [
  'food',
  'beauty',
];

const FOOD_KEYWORDS = [
  '요리',
  '레시피',
  '먹방',
  '쿠킹',
  '베이킹',
  'cook',
  'recipe',
  'food',
  'baking',
  'kitchen',
  '料理',
  'グルメ',
  '食べ',
  'レシピ',
];

const BEAUTY_KEYWORDS = [
  '메이크업',
  '뷰티',
  '화장',
  '스킨케어',
  'makeup',
  'beauty',
  'skincare',
  'cosmetic',
  'メイク',
  'コスメ',
  '美容',
];

function titleMatches(title: string, keywords: string[]) {
  const lower = title.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function filterHowtoBucket<T extends { snippet: { title: string } }>(
  videos: T[],
  category: 'food' | 'beauty',
): T[] {
  const keywords = category === 'food' ? FOOD_KEYWORDS : BEAUTY_KEYWORDS;
  return videos.filter((v) => titleMatches(v.snippet.title, keywords));
}
