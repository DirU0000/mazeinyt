export type ViralTier = 'explosive' | 'fast' | 'steady' | 'core';
export type EngagementTier = 'high' | 'normal' | 'low';

export function getViralTier(ratio: number): ViralTier {
  if (ratio >= 10) return 'explosive';
  if (ratio >= 3) return 'fast';
  if (ratio >= 1) return 'steady';
  return 'core';
}

export function getEngagementTier(ratePercent: number): EngagementTier {
  if (ratePercent >= 5) return 'high';
  if (ratePercent >= 2) return 'normal';
  return 'low';
}
