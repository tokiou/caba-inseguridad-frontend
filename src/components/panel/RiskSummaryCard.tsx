import { useRouteStore } from '@/store/routeStore'
import { RISK_COLORS } from '@/utils/safetyColors'
import { formatExposurePercent } from '@/utils/formatStats'
import { RISK_LABELS, contextSubtitle } from '@/utils/routeKind'

export default function RiskSummaryCard() {
  const { response, selectedKind, routeByKind } = useRouteStore()
  if (!response) return null

  const route = routeByKind(selectedKind) ?? response.routes[0]
  if (!route) return null

  const color = RISK_COLORS[route.risk_level]
  const exposurePct = formatExposurePercent(route.risk_score)
  const reduction = Math.round(route.risk_reduction_vs_fastest_percent)

  return (
    <div className="animate-slide-up space-y-3">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Resultado</span>
        <span className="text-[11px] text-[#6e7689]">
          {contextSubtitle(response.time_bucket, response.weekday_type)}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <span className="flex items-center gap-2 text-[15px] font-semibold" style={{ color }}>
          <span
            className="h-2.5 w-2.5 flex-shrink-0 rounded-none"
            style={{ background: color }}
          />
          {RISK_LABELS[route.risk_level]}
        </span>
        <span className="text-2xl font-bold tabular-nums" style={{ color }}>
          {exposurePct}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-none bg-white/[0.07]">
        <div
          className="h-full rounded-none transition-[width] duration-700 ease-out"
          style={{ width: `${exposurePct}%`, background: color }}
        />
      </div>

      <p className="text-xs text-[#8B93A7]">
        {exposurePct}% de exposición histórica estimada
        {reduction > 0 && (
          <>
            {' · '}
            <span className="font-semibold text-[#F5F7FA]">−{reduction}% exposición</span> que la
            ruta más rápida
          </>
        )}
      </p>
    </div>
  )
}
