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
  // 한국어
  '요리', '레시피', '먹방', '쿠킹', '베이킹', '음식', '맛집', '식당', '맛있', '먹는', '간식', '디저트',
  // 영어
  'cook', 'recipe', 'food', 'baking', 'kitchen',
  'eat', 'eating', 'meal', 'restaurant', 'snack', 'dessert',
  'tasty', 'delicious', 'yummy', 'dinner', 'lunch', 'breakfast',
  // 일본어
  '料理', 'グルメ', '食べ', 'レシピ', 'ご飯', 'ラーメン', 'お菓子', 'レストラン', 'おいしい',
];

const BEAUTY_KEYWORDS = [
  // 한국어
  '메이크업', '뷰티', '화장', '스킨케어', '네일', '헤어', '립스틱', '마스카라', '아이라이너', '파운데이션', '선크림', '색조',
  '피부', '클렌징', '팩', '마스크팩', '피부관리', '쿠션', '비비크림', '틴트', '왁싱', '선스틱', '화장품',
  // 영어
  'makeup', 'beauty', 'skincare', 'skin care', 'cosmetic',
  'nail art', 'nail polish', 'nail tutorial', 'nail design', 'nail',
  'hair care', 'haircut', 'hair color', 'hair dye', 'hairstyle',
  'foundation', 'lipstick', 'lip gloss', 'mascara', 'eyeshadow', 'eye shadow',
  'blush', 'highlighter', 'contour', 'eyelash', 'eyebrow', 'brow tutorial',
  'glam', 'moisturizer', 'serum', 'sunscreen', 'perfume', 'fragrance', 'toner', 'face mask',
  'primer', 'concealer', 'palette', 'haul', 'grwm', 'get ready with me',
  'glow up', 'bb cream', 'cc cream', 'self care', 'skin routine',
  // 일본어
  'メイク', 'メイクアップ', 'コスメ', '美容', 'ネイル', 'ネイルアート', 'ヘアケア', 'ヘアカラー', 'ヘアアレンジ',
  'リップ', 'マスカラ', 'アイシャドウ', 'ファンデ', '日焼け止め',
  'スキンケア', 'ビューティー', 'プチプラ', '保湿', 'クレンジング', '化粧',
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
