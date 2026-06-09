import { AlertTriangle, Crosshair, Clock, Route, Timer } from 'lucide-react'
import RobberyBadge from './RobberyBadge'
import { useRouteStore } from '@/store/routeStore'
import { SAFETY_COLORS } from '@/utils/safetyColors'
import { formatArmedPercentage, formatDistance, formatDuration } from '@/utils/formatStats'
import type { SafetyLevel } from '@/types/route'

const SAFETY_LABELS: Record<SafetyLevel, string> = {
  safe: 'Ruta segura',
  moderate: 'Riesgo moderado',
  danger: 'Ruta peligrosa',
  no_data: 'Sin datos suficientes',
}

export default function RouteStats() {
  const { activeRoute, selectedSegment } = useRouteStore()

  if (!activeRoute) return null

  const { summary } = activeRoute
  const safetyColor = SAFETY_COLORS[summary.safety_label]
  const safetyLabel = SAFETY_LABELS[summary.safety_label]

  const displayStats = selectedSegment
    ? {
        robbery_count: selectedSegment.properties.robbery_count,
        armed_robbery_count: selectedSegment.properties.armed_robbery_count,
        hour_range: selectedSegment.properties.hour_range,
        isSegment: true,
      }
    : {
        robbery_count: summary.total_robbery_count,
        armed_robbery_count: summary.armed_robbery_count,
        hour_range: activeRoute.features[0]?.properties.hour_range ?? '',
        isSegment: false,
      }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 rounded-lg px-3.5 py-3" style={{ backgroundColor: `${safetyColor}18`, border: `1px solid ${safetyColor}30` }}>
        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: safetyColor }} />
        <span className="text-sm font-semibold" style={{ color: safetyColor }}>
          {safetyLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-white/5 py-3">
          <Route size={14} className="mb-1 text-white/40" />
          <p className="text-base font-bold text-white">{formatDistance(summary.distance_km)}</p>
          <p className="text-[10px] text-white/30">distancia</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-white/5 bg-white/5 py-3">
          <Timer size={14} className="mb-1 text-white/40" />
          <p className="text-base font-bold text-white">{formatDuration(summary.estimated_minutes)}</p>
          <p className="text-[10px] text-white/30">estimado</p>
        </div>
      </div>

      {selectedSegment && (
        <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <p className="text-xs text-white/50">Segmento seleccionado</p>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-white/50">
            {displayStats.isSegment ? 'En este segmento' : 'En toda la ruta'}
          </p>
          {displayStats.hour_range && (
            <div className="flex items-center gap-1 text-white/30">
              <Clock size={11} />
              <span className="text-[10px]">{displayStats.hour_range}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <RobberyBadge
            count={displayStats.robbery_count}
            label="robos registrados"
            icon={<AlertTriangle size={18} />}
            color="#f59e0b"
          />
          <RobberyBadge
            count={displayStats.armed_robbery_count}
            label={`con armas (${formatArmedPercentage(displayStats.armed_robbery_count, displayStats.robbery_count)})`}
            icon={<Crosshair size={18} />}
            color="#ef4444"
          />
        </div>
      </div>
    </div>
  )
}
