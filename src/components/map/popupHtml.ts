import type { RiskLevel, SafeRoute } from '@/types/route'
import { RISK_COLORS } from '@/utils/safetyColors'
import { KIND_LABELS, RISK_LABELS } from '@/utils/routeKind'
import { formatDuration, formatExposurePercent, formatMeters } from '@/utils/formatStats'

const ICON_ROUTE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>`
const ICON_CLOCK = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
const ICON_ALERT = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F5B82E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`

/** Composición relativa de exposición (NO conteos): proporciones dentro de crime_count. */
const COMPOSITION: { key: 'robbery_count' | 'theft_count' | 'armed_count' | 'threats_count'; label: string }[] = [
  { key: 'robbery_count', label: 'Robos' },
  { key: 'theft_count', label: 'Hurtos' },
  { key: 'armed_count', label: 'Con arma' },
  { key: 'threats_count', label: 'Amenazas' },
]

function riskBarColor(score: number, level: RiskLevel): string {
  // El color sigue el nivel de la ruta; el ancho, el peso relativo.
  void score
  return RISK_COLORS[level]
}

export function renderRoutePopupHtml(route: SafeRoute): string {
  const color = RISK_COLORS[route.risk_level]
  const isFastest = route.kind === 'fastest'

  const vsFastest =
    !isFastest && route.extra_distance_vs_fastest_meters > 0
      ? `<div class="rp-row">${ICON_ROUTE}<span><b>+${formatMeters(route.extra_distance_vs_fastest_meters)}</b> · <span style="color:${RISK_COLORS.low}">−${Math.round(route.risk_reduction_vs_fastest_percent)}% exposición</span> vs la más rápida</span></div>`
      : ''

  const worstEdge =
    route.high_risk_edge_percent > 0
      ? `<div class="rp-row">${ICON_ALERT}<span><b>${route.high_risk_edge_percent.toFixed(1)}%</b> del trayecto en tramos de riesgo alto (pico ${formatExposurePercent(route.max_edge_risk)}%)</span></div>`
      : ''

  const total = route.crime_metrics.crime_count || 1
  const composition = `
    <div class="rp-chart">
      <p class="rp-chart-title">Composición de exposición (relativa)</p>
      ${COMPOSITION.map(({ key, label }) => {
        const ratio = route.crime_metrics[key] / total
        return `<div class="rp-bar">
          <span class="rp-bar-hour">${label}</span>
          <div class="rp-bar-track"><div class="rp-bar-fill" style="width:${Math.round(ratio * 100)}%;background:${riskBarColor(ratio, route.risk_level)}"></div></div>
          <span class="rp-bar-count">${Math.round(ratio * 100)}%</span>
        </div>`
      }).join('')}
    </div>`

  return `
    <div class="rp-head">
      <span class="rp-dot" style="background:${color};box-shadow:0 0 8px ${color}"></span>
      <span class="rp-level" style="color:${color}">${RISK_LABELS[route.risk_level]}</span>
      <span class="rp-kind">${KIND_LABELS[route.kind]}</span>
    </div>
    <div class="rp-row">${ICON_ROUTE}<span><b>${formatMeters(route.distance_meters)}</b> de recorrido</span></div>
    <div class="rp-row">${ICON_CLOCK}<span><b>${formatDuration(route.duration_minutes)}</b> caminando</span></div>
    ${vsFastest}
    ${worstEdge}
    ${composition}
    <p class="rp-note">Exposición histórica estimada al delito · sin garantías de seguridad.</p>
  `
}
