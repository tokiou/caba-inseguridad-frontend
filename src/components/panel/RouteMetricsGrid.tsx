import { useRouteStore } from '@/store/routeStore'
import {
  formatDuration,
  formatExposurePercent,
  formatExtraDuration,
  formatExtraMeters,
  formatMeters,
} from '@/utils/formatStats'

interface Metric {
  value: string
  label: string
  accent?: string
}

function MetricCell({ value, label, accent }: Metric) {
  return (
    <div>
      <p
        className="text-[21px] font-semibold leading-none tabular-nums"
        style={{ color: accent ?? '#F5F7FA' }}
      >
        {value}
      </p>
      <p className="eyebrow mt-2">{label}</p>
    </div>
  )
}

export default function RouteMetricsGrid() {
  const { response, selectedKind, routeByKind } = useRouteStore()
  if (!response) return null

  const route = routeByKind(selectedKind) ?? response.routes[0]
  if (!route) return null

  const isFastest = route.kind === 'fastest'

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5">
      <MetricCell value={formatMeters(route.distance_meters)} label="Distancia" />
      <MetricCell value={formatDuration(route.duration_minutes)} label="Caminando" />
      {isFastest ? (
        <MetricCell
          value={`${formatExposurePercent(route.max_edge_risk)}%`}
          label="Pico de exposición"
          accent="#FF4D4D"
        />
      ) : (
        <MetricCell value={formatExtraMeters(route.extra_distance_vs_fastest_meters)} label="Desvío vs rápida" />
      )}
      {isFastest ? (
        <MetricCell
          value={`${route.high_risk_edge_percent.toFixed(0)}%`}
          label="Tramo riesgo alto"
          accent="#FF4D4D"
        />
      ) : (
        <MetricCell
          value={formatExtraDuration(route.extra_duration_vs_fastest_minutes)}
          label="Tiempo extra"
        />
      )}
    </div>
  )
}
