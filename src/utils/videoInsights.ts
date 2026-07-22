export type ViralTier = 'explosive' | 'fast' | 'steady' | 'core';
export type EngagementTier = 'high' | 'normal' | 'low';
export type ChannelTier = 'mega' | 'large' | 'medium' | 'small' | 'micro' | 'nano';

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

export function getChannelTier(subscribers: number): ChannelTier {
  if (subscribers >= 10_000_000) return 'mega';
  if (subscribers >= 1_000_000) return 'large';
  if (subscribers >= 100_000) return 'medium';
  if (subscribers >= 10_000) return 'small';
  if (subscribers >= 1_000) return 'micro';
  return 'nano';
}
