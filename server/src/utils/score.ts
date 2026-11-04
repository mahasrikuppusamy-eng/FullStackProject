/**
 * Accessibility Score Calculation Utility for AccessAble Coimbatore
 * 
 * Score breakdown (0–100):
 * - wheelchairRamp: +18
 * - lift: +12
 * - accessibleToilet: +18
 * - parking: +10
 * - braille: +8
 * - audioAssistance: +8
 * - review rating: up to +26 (pro-rated based on averageRating out of 5)
 * Total max = 74 (features) + 26 (reviews) = 100
 */

export interface AccessibilityFeatures {
  wheelchairRamp?: boolean;
  lift?: boolean;
  accessibleToilet?: boolean;
  parking?: boolean;
  braille?: boolean;
  audioAssistance?: boolean;
}

export function calculateAccessibilityScore(
  features: AccessibilityFeatures = {},
  averageRating: number = 0,
  reviewCount: number = 0
): number {
  let score = 0;

  if (features.wheelchairRamp) score += 18;
  if (features.lift) score += 12;
  if (features.accessibleToilet) score += 18;
  if (features.parking) score += 10;
  if (features.braille) score += 8;
  if (features.audioAssistance) score += 8;

  // Review contribution: up to 26 points based on average rating
  // If there are reviews, calculate proportionally
  if (reviewCount > 0 && averageRating > 0) {
    const ratingScore = Math.min(26, Math.max(0, Math.round((averageRating / 5) * 26)));
    score += ratingScore;
  } else {
    // If no reviews yet, neutral baseline (13 pts) or 0.
    // Based on spec: "review rating up to +26. Recomputed on every place update and review write."
    // When reviewCount is 0, no review bonus is added.
  }

  return Math.min(100, Math.max(0, score));
}

export function getScoreCategory(score: number): {
  category: 'High' | 'Moderate' | 'Low';
  color: 'green' | 'amber' | 'red';
  hex: string;
} {
  if (score >= 70) {
    return { category: 'High', color: 'green', hex: '#16a34a' };
  } else if (score >= 40) {
    return { category: 'Moderate', color: 'amber', hex: '#d97706' };
  } else {
    return { category: 'Low', color: 'red', hex: '#dc2626' };
  }
}
