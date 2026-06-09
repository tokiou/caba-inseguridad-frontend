import type { SafetyLevel } from '@/types/route'

export const SAFETY_COLORS: Record<SafetyLevel, string> = {
  safe: '#22c55e',
  moderate: '#f59e0b',
  danger: '#ef4444',
  no_data: '#6b7280',
}

export function scoreToLevel(score: number): SafetyLevel {
  if (score >= 0.7) return 'safe'
  if (score >= 0.4) return 'moderate'
  if (score >= 0) return 'danger'
  return 'no_data'
}

export function scoreToColor(score: number): string {
  return SAFETY_COLORS[scoreToLevel(score)]
}
