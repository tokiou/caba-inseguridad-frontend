import type { RiskLevel, RouteKind } from '@/types/route'

/** Color por nivel de riesgo agregado (badges del panel / popup). */
export const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#00E599',
  moderate: '#F5B82E',
  high: '#FF4D4D',
}

/** Color de la línea por tipo de ruta en el mapa (ver contrato §7). */
export const KIND_COLORS: Record<RouteKind, string> = {
  safest: '#00E599',
  balanced: '#F5B82E',
  fastest: '#FF4D4D',
  least_safe_candidate: '#7B8191',
}

export function riskLevelColor(level: RiskLevel): string {
  return RISK_COLORS[level]
}

export function kindColor(kind: RouteKind): string {
  return KIND_COLORS[kind]
}
