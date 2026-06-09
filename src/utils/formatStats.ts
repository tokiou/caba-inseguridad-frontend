export function formatRobberyCount(count: number): string {
  return count === 1 ? '1 robo registrado' : `${count} robos registrados`
}

export function formatArmedPercentage(armed: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((armed / total) * 100)}%`
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
