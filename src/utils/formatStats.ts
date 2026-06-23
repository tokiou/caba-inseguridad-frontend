/** Distancia en metros → "850 m" o "5.9 km". */
export function formatMeters(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`
}

/** Duración en minutos (puede venir con decimales) → "12 min" o "1 h 10 min". */
export function formatDuration(minutes: number): string {
  const total = Math.round(minutes)
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/** risk_score (0..1) → porcentaje de exposición estimada. */
export function formatExposurePercent(score: number): number {
  return Math.round(score * 100)
}

/** Diferencia de distancia vs fastest → "+903 m". */
export function formatExtraMeters(meters: number): string {
  if (meters <= 0) return '—'
  return `+${formatMeters(meters)}`
}

/** Diferencia de tiempo vs fastest → "+11 min". */
export function formatExtraDuration(minutes: number): string {
  if (minutes <= 0) return '—'
  return `+${formatDuration(minutes)}`
}
