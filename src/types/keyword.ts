export interface Keyword {
  word: string;
  count: number;
}

export type KeywordsByCountry = {
  us: Keyword[];
  jp: Keyword[];
  kr: Keyword[];
};
