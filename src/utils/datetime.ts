/**
 * Construye un datetime RFC3339 con offset -03:00 (America/Argentina/Buenos_Aires)
 * para la fecha actual a la hora elegida (0–23). Se evita toISOString() (UTC 'Z')
 * para que el time_bucket/weekday_type que resuelve el backend coincida con la
 * franja horaria local que ve el usuario.
 *
 * Ej: hour=23 un 2026-06-12 → "2026-06-12T23:00:00-03:00"
 */
export function buildBuenosAiresDatetime(hour: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const date = `${get('year')}-${get('month')}-${get('day')}`
  const hh = String(hour).padStart(2, '0')
  return `${date}T${hh}:00:00-03:00`
}
