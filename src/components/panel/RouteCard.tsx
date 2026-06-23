import Sparkline from './Sparkline'
import { RISK_COLORS, KIND_COLORS } from '@/utils/safetyColors'
import { formatDuration, formatMeters } from '@/utils/formatStats'
import { CARD_TITLE_BY_KIND } from '@/utils/routeKind'
import type { RiskLevel, SafeRoute } from '@/types/route'

const BADGE_LABELS: Record<RiskLevel, string> = {
  low: 'Riesgo bajo',
  moderate: 'Riesgo medio',
  high: 'Riesgo alto',
}

const EXPOSURE_LABELS: Record<RiskLevel, string> = {
  low: 'Baja',
  moderate: 'Media',
  high: 'Alta',
}

interface Props {
  route: SafeRoute
  selected: boolean
  onSelect: () => void
}

function subtitle(route: SafeRoute): string {
  if (route.kind === 'fastest') return 'Ruta más directa'
  const reduction = Math.round(route.risk_reduction_vs_fastest_percent)
  if (reduction > 0) return `−${reduction}% exposición vs la más rápida`
  return 'Similar a la más rápida'
}

export default function RouteCard({ route, selected, onSelect }: Props) {
  const riskColor = RISK_COLORS[route.risk_level]
  const kindColor = KIND_COLORS[route.kind]
  const spark = route.segments?.map((s) => s.risk_score) ?? [
    route.avg_edge_risk,
    route.risk_score,
    route.max_edge_risk,
    route.avg_edge_risk,
  ]

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="flex-1 rounded-none border bg-[#0e0f13]/95 p-3.5 text-left backdrop-blur-md transition"
      style={{
        borderColor: selected ? kindColor : 'rgba(255,255,255,0.08)',
        boxShadow: selected ? `0 0 0 1px ${kindColor}, 0 10px 30px rgba(0,0,0,0.4)` : '0 10px 30px rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-[#F5F7FA]">
          <span className="h-2.5 w-2.5 rounded-none" style={{ background: kindColor }} />
          {CARD_TITLE_BY_KIND[route.kind]}
        </span>
        <span
          className="rounded-none px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: `${riskColor}1f`, color: riskColor }}
        >
          {BADGE_LABELS[route.risk_level]}
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-[26px] font-bold leading-none tabular-nums text-[#F5F7FA]">
          {formatDuration(route.duration_minutes)}
        </span>
        <span className="text-[13px] tabular-nums text-[#8B93A7]">
          {formatMeters(route.distance_meters)}
        </span>
      </div>

      <p className="mt-1 truncate text-[11px] text-[#6e7689]">{subtitle(route)}</p>

      <div className="mt-2.5">
        <Sparkline values={spark} color={riskColor} width={200} height={28} />
      </div>

      <p className="mt-1.5 text-[11px] text-[#6e7689]">
        Exposición al riesgo:{' '}
        <span className="font-semibold" style={{ color: riskColor }}>
          {EXPOSURE_LABELS[route.risk_level]}
        </span>
      </p>
    </button>
  )
}
