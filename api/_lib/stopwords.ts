/**
 * 제목 키워드 집계용 불용어. 완벽한 형태소 분석이 아니라 간단한 공백/기호 분리 기준이라
 * 한국어 조사가 붙은 단어("강아지가"/"강아지는")는 분리되지 않고, 일본어는 공백이 없어
 * 문장이 통째로 하나의 토큰이 되는 경우가 많다 — 알려진 한계.
 */
export const STOPWORDS = new Set([
  // 영어 (일반 불용어)
  'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'is',
  'it', 'its', 'this', 'that', 'these', 'those', 'with', 'by', 'from', 'my',
  'your', 'his', 'her', 'their', 'our', 'i', 'you', 'we', 'he', 'she', 'they',
  'me', 'him', 'them', 'us', 'am', 'are', 'be', 'been', 'being', 'was',
  'were', 'not', 'no', 'nor', 'but', 'so', 'just', 'how', 'what', 'why',
  'who', 'whom', 'which', 'when', 'where', 'vs', 'ep', 'part', 'full', 'new',
  'will', 'would', 'can', 'could', 'should', 'shall', 'do', 'does', 'did',
  'doing', 'done', 'has', 'have', 'had', 'having', 'if', 'then', 'than',
  'into', 'out', 'up', 'down', 'over', 'under', 'again', 'further', 'once',
  'here', 'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'only', 'own', 'same', 'too', 'very', 'now',
  'every', 'as', 'man', 'get', 'got', 'one', 'day', 'time',
  // 유튜브 상투어
  'official', 'video', 'mv', 'music', 'ft', 'feat', 'featuring', 'prod',
  'lyrics', 'audio', 'cover', 'live', 'shorts', 'trailer', 'teaser', 'hd',
  '4k', 'episode',
  // 한국어 상투어/조사성 표현
  '오늘', '근황', '진짜', '정말', '너무', '공식', '뮤직비디오', '뮤비',
  '라이브', '예고편', '풀버전', '최초공개', '하는', '했다', '합니다', '이다',
  // 연도
  '2023', '2024', '2025', '2026', '2027',
]);
