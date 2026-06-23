import type {
  DominantFactor,
  RiskLevel,
  RouteKind,
  TimeBucket,
  WeekdayType,
} from '@/types/route'

/** Orden de apilado/listado: de recomendada a contraste. */
export const ROUTE_KIND_ORDER: RouteKind[] = [
  'safest',
  'balanced',
  'fastest',
  'least_safe_candidate',
]

/** Etiquetas en lenguaje de exposición (sin prometer seguridad). */
export const KIND_LABELS: Record<RouteKind, string> = {
  safest: 'Menor exposición',
  balanced: 'Balanceada',
  fastest: 'Más rápida',
  least_safe_candidate: 'Mayor exposición',
}

export const KIND_SHORT_LABELS: Record<RouteKind, string> = {
  safest: 'Segura',
  balanced: 'Balanceada',
  fastest: 'Rápida',
  least_safe_candidate: 'Contraste',
}

/** Títulos de las tarjetas inferiores / detalle. */
export const CARD_TITLE_BY_KIND: Record<RouteKind, string> = {
  fastest: 'Más rápida',
  balanced: 'Balanceada',
  safest: 'Más segura',
  least_safe_candidate: 'Contraste',
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Exposición baja',
  moderate: 'Exposición moderada',
  high: 'Exposición alta',
}

const TIME_BUCKET_LABELS: Record<TimeBucket, string> = {
  morning: 'Ruta matutina',
  afternoon: 'Ruta de tarde',
  evening: 'Ruta de noche temprana',
  night: 'Ruta nocturna',
}

const WEEKDAY_LABELS: Record<WeekdayType, string> = {
  weekday: 'día de semana',
  weekend: 'fin de semana',
}

export function contextSubtitle(bucket: TimeBucket, weekday: WeekdayType): string {
  return `${TIME_BUCKET_LABELS[bucket]} · ${WEEKDAY_LABELS[weekday]}`
}

/** Tipo de delito dominante en plural, para la frase de "qué". */
export const DOMINANT_FACTOR_LABELS: Record<DominantFactor, string> = {
  robbery: 'robos',
  theft: 'hurtos',
  threats: 'amenazas',
  none: '—',
}

/** Sustantivo de cada franja, para "mayor exposición de {…}". */
export const BUCKET_NOUN: Record<TimeBucket, string> = {
  morning: 'la mañana',
  afternoon: 'la tarde',
  evening: 'la tardecita',
  night: 'la noche',
}

/** Etiqueta corta de franja para la mini-visualización. */
export const BUCKET_SHORT: Record<TimeBucket, string> = {
  morning: 'Mañana',
  afternoon: 'Tarde',
  evening: 'Tardecita',
  night: 'Noche',
}
