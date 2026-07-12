export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `${value}`;
}

/** 구독자 대비 조회수 배율: 10 이상은 정수, 미만은 소수 1자리로 반올림. */
export function formatRatio(value: number): number {
  return value >= 10 ? Math.round(value) : Number(value.toFixed(1));
}
