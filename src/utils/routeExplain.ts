import type { SafeRoute } from '@/types/route'
import { BUCKET_NOUN, DOMINANT_FACTOR_LABELS } from './routeKind'
import { formatExposurePercent } from './formatStats'

// El backend NO envía texto: estos helpers componen la prosa desde la metadata,
// en lenguaje de EXPOSICIÓN HISTÓRICA RELATIVA. Nunca se muestran los conteos
// crudos como "N delitos" (son sumas de exposición por tramo, no eventos);
// solo se usan magnitudes relativas (risk_score %, armed_share_percent).

/** DÓNDE — la cuadra que dispara el riesgo. `null` si la ruta no tiene tramos. */
export function dondePhrase(route: SafeRoute): string | null {
  const s = route.riskiest_segment
  if (!s) return null
  const pct = formatExposurePercent(s.risk_score)
  return `Una cuadra puntual concentra la mayor exposición del trayecto (${pct}%).`
}

/** QUÉ — tipo de delito dominante + proporción con arma. `null` si no aplica. */
export function quePhrase(route: SafeRoute): string | null {
  if (route.dominant_factor === 'none') return null
  const armed = Math.round(route.armed_share_percent)
  const factor = DOMINANT_FACTOR_LABELS[route.dominant_factor]
  return `Predomina la exposición a ${factor}; ~${armed}% de los incidentes fueron con arma.`
}

/** CUÁNDO — franja de mayor exposición. `null` si no hay datos por franja. */
export function cuandoPhrase(route: SafeRoute): string | null {
  const t = route.time_of_day_risk
  if (!t) return null
  return `Mayor exposición histórica durante ${BUCKET_NOUN[t.peak_bucket]}.`
}
