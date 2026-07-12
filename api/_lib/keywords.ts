import type { Country } from '../../src/types/video.js';
import { getTrendingForCountry } from './trending.js';
import { STOPWORDS } from './stopwords.js';

export interface Keyword {
  word: string;
  count: number;
}

const MERGE_MIN_COUNT = 2;
const MERGE_RATIO = 0.6;

function tokenize(title: string): string[] {
  // 유니코드 문자/숫자가 아닌 것(기호·이모지·구두점)은 전부 구분자로 취급한다.
  return title
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

function isNumberOrTooShort(token: string) {
  return /^\d+$/.test(token) || token.length < 2;
}

/**
 * 제목별로 단어/연속 단어 조합이 등장한 "제목 수"를 센다 (같은 제목 내 반복은 1회만).
 * 거의 항상 붙어 다니는 인접 단어들은 하나의 구(phrase)로 이어붙인다.
 * (예: "메챠"+"카멜레온" → "메챠 카멜레온", "minecraft"+"but" → "minecraft but")
 */
export function extractKeywords(titles: string[], topN = 15): Keyword[] {
  const rawFreq = new Map<string, number>();
  const bigramFreq = new Map<string, number>();
  const tokensByTitle: string[][] = [];

  for (const title of titles) {
    const tokens = tokenize(title).filter((t) => !isNumberOrTooShort(t));
    tokensByTitle.push(tokens);

    const seenWords = new Set<string>();
    for (const tok of tokens) {
      if (seenWords.has(tok)) continue;
      seenWords.add(tok);
      rawFreq.set(tok, (rawFreq.get(tok) ?? 0) + 1);
    }

    const seenBigrams = new Set<string>();
    for (let i = 0; i < tokens.length - 1; i++) {
      const w1 = tokens[i];
      const w2 = tokens[i + 1];
      if (STOPWORDS.has(w1) && STOPWORDS.has(w2)) continue;
      const key = `${w1} ${w2}`;
      if (seenBigrams.has(key)) continue;
      seenBigrams.add(key);
      bigramFreq.set(key, (bigramFreq.get(key) ?? 0) + 1);
    }
  }

  function qualifies(w1: string, w2: string) {
    const count = bigramFreq.get(`${w1} ${w2}`);
    if (!count || count < MERGE_MIN_COUNT) return false;
    const c1 = rawFreq.get(w1) ?? count;
    const c2 = rawFreq.get(w2) ?? count;
    return Math.max(count / c1, count / c2) >= MERGE_RATIO;
  }

  // 이어지는 조건을 만족하는 인접 단어들을 하나의 구로 체이닝한다.
  const phraseFreq = new Map<string, number>();
  const consumedCount = new Map<string, number>();

  for (const tokens of tokensByTitle) {
    const seenPhrases = new Set<string>();
    const consumedThisTitle = new Set<string>();
    let i = 0;
    while (i < tokens.length) {
      if (i + 1 < tokens.length && qualifies(tokens[i], tokens[i + 1])) {
        const chain = [tokens[i], tokens[i + 1]];
        let j = i + 1;
        while (j + 1 < tokens.length && qualifies(tokens[j], tokens[j + 1])) {
          chain.push(tokens[j + 1]);
          j++;
        }
        const phraseKey = chain.join(' ');
        if (!seenPhrases.has(phraseKey)) {
          seenPhrases.add(phraseKey);
          phraseFreq.set(phraseKey, (phraseFreq.get(phraseKey) ?? 0) + 1);
        }
        for (const w of chain) consumedThisTitle.add(w);
        i = j + 1;
      } else {
        i++;
      }
    }
    for (const w of consumedThisTitle) {
      consumedCount.set(w, (consumedCount.get(w) ?? 0) + 1);
    }
  }

  // 화면에 노출할 단일 단어 집계 (불용어 제외, 구에 흡수된 만큼은 차감)
  const displayUnigram = new Map<string, number>();
  for (const [word, count] of rawFreq) {
    if (STOPWORDS.has(word)) continue;
    const leftover = count - (consumedCount.get(word) ?? 0);
    if (leftover > 0) displayUnigram.set(word, leftover);
  }

  const combined: Keyword[] = [
    ...Array.from(phraseFreq.entries()).map(([word, count]) => ({
      word,
      count,
    })),
    ...Array.from(displayUnigram.entries()).map(([word, count]) => ({
      word,
      count,
    })),
  ];

  return combined.sort((a, b) => b.count - a.count).slice(0, topN);
}

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 최근 1주일
const MIN_RECENT_POOL = 10; // 이보다 적게 남으면 기간 필터 없이 전체 풀로 대체
const TOP_VIEWED_COUNT = 50; // 그중 조회수 상위 N개만 키워드 분석에 사용

export async function getKeywordsForCountry(
  country: Exclude<Country, 'global'>,
): Promise<Keyword[]> {
  const videos = await getTrendingForCountry(country, 'all');

  const cutoff = Date.now() - RECENT_WINDOW_MS;
  const recent = videos.filter(
    (v) => new Date(v.publishedAt).getTime() >= cutoff,
  );
  const pool = recent.length >= MIN_RECENT_POOL ? recent : videos;

  const topViewed = [...pool]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, TOP_VIEWED_COUNT);

  return extractKeywords(topViewed.map((v) => v.title));
}
