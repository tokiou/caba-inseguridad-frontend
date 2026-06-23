import { X, MapPin, ShieldAlert, Clock, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useRouteStore } from '@/store/routeStore'
import { CARD_TITLE_BY_KIND } from '@/utils/routeKind'
import { KIND_COLORS, RISK_COLORS } from '@/utils/safetyColors'
import {
  formatDuration,
  formatExposurePercent,
  formatMeters,
} from '@/utils/formatStats'
import { dondePhrase, quePhrase, cuandoPhrase } from '@/utils/routeExplain'
import type { RiskLevel } from '@/types/route'

const RISK_WORD: Record<RiskLevel, string> = { low: 'bajo', moderate: 'medio', high: 'alto' }
const EXPOSURE_WORD: Record<RiskLevel, string> = { low: 'Baja', moderate: 'Media', high: 'Alta' }

const SEGMENTS = 18

/** Interpola verde → amarillo → rojo según la fracción 0..1. */
function gradientColor(f: number): string {
  const stops = [
    [0x00, 0xe5, 0x99],
    [0xf5, 0xb8, 0x2e],
    [0xff, 0x4d, 0x4d],
  ]
  const x = Math.min(1, Math.max(0, f)) * 2
  const i = Math.min(1, Math.floor(x))
  const t = x - i
  const [r, g, b] = stops[i].map((c, k) => Math.round(c + (stops[i + 1][k] - c) * t))
  return `rgb(${r},${g},${b})`
}

function shortLabel(name?: string | null) {
  return name ? name.split(',').slice(0, 2).join(',').trim() : ''
}

interface Row {
  label: string
  value: string
  accent?: string
}

export default function RouteDetailPanel() {
  const { detailOpen, setDetailOpen } = useUIStore()
  const { response, selectedKind, routeByKind, origin, destination, setFocusPoint } =
    useRouteStore()

  if (!detailOpen || !response) return null
  const route = routeByKind(selectedKind) ?? response.routes[0]
  if (!route) return null

  const kindColor = KIND_COLORS[route.kind]
  const riskColor = RISK_COLORS[route.risk_level]
  const exposurePct = formatExposurePercent(route.risk_score)
  const filled = Math.max(1, Math.round((exposurePct / 100) * SEGMENTS))

  // Exposición relativa a la ruta de menor exposición.
  const safest = routeByKind('safest')
  let vsSafest: string | null = null
  if (safest && safest.kind !== route.kind && safest.risk_score > 0) {
    const diff = Math.round(((route.risk_score - safest.risk_score) / safest.risk_score) * 100)
    if (diff > 0) vsSafest = `+${diff}% vs la ruta más segura`
    else if (diff < 0) vsSafest = `${diff}% vs la ruta más segura`
  } else if (safest && safest.kind === route.kind) {
    vsSafest = 'Es la ruta de menor exposición'
  }

  const rows: Row[] = [
    { label: 'Tiempo caminando', value: formatDuration(route.duration_minutes) },
    { label: 'Distancia', value: formatMeters(route.distance_meters) },
    {
      label: 'Pico de exposición',
      value: `${formatExposurePercent(route.max_edge_risk)}%`,
      accent: '#FF4D4D',
    },
    { label: 'Tramos sensibles', value: `${route.high_risk_edge_percent.toFixed(0)}%` },
  ]
  if (vsSafest) {
    rows.push({
      label: 'Exposición vs. más segura',
      value: vsSafest.replace(' vs la ruta más segura', '').replace('Es la ruta de menor exposición', '—'),
      accent: vsSafest.startsWith('+') ? '#FF4D4D' : '#00E599',
    })
  }

  const donde = dondePhrase(route)
  const que = quePhrase(route)
  const cuando = cuandoPhrase(route)
  const riskiest = route.riskiest_segment?.point

  return (
    <aside className="animate-slide-up flex h-full w-[340px] flex-shrink-0 flex-col border-l border-white/[0.07] bg-[#0a0b0e]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <h2 className="text-[15px] font-semibold text-[#F5F7FA]">Detalle de la ruta</h2>
        <button
          type="button"
          onClick={() => setDetailOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-none text-[#8B93A7] transition hover:bg-white/[0.06] hover:text-[#F5F7FA]"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="panel-scroll flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
        {/* Identidad + badge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-[14px] font-semibold text-[#F5F7FA]">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: kindColor }} />
              {CARD_TITLE_BY_KIND[route.kind]}
            </span>
            <span
              className="rounded-none px-2 py-0.5 text-[11px] font-semibold"
              style={{ color: riskColor, background: `${riskColor}1f` }}
            >
              Riesgo {RISK_WORD[route.risk_level]}
            </span>
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-[28px] font-bold leading-none tracking-tight text-[#F5F7FA]">
              {formatDuration(route.duration_minutes)}
            </span>
            <span className="text-[15px] font-medium text-[#8B93A7]">
              {formatMeters(route.distance_meters)}
            </span>
          </div>

          {(origin || destination) && (
            <p className="truncate text-[12px] text-[#8B93A7]">
              {shortLabel(origin?.label) || 'Origen'} → {shortLabel(destination?.label) || 'Destino'}
            </p>
          )}
        </div>

        {/* Exposición estimada */}
        <div className="space-y-2.5">
          <span className="eyebrow">Exposición estimada</span>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-[3px]">
              {Array.from({ length: SEGMENTS }).map((_, i) => (
                <span
                  key={i}
                  className="h-2.5 flex-1 rounded-none transition-colors"
                  style={{
                    background: i < filled ? gradientColor(i / (SEGMENTS - 1)) : 'rgba(255,255,255,0.07)',
                  }}
                />
              ))}
            </div>
            <span className="text-[12px] font-semibold" style={{ color: riskColor }}>
              {EXPOSURE_WORD[route.risk_level]}
            </span>
          </div>
          {vsSafest && <p className="text-[11px] text-[#8B93A7]">{vsSafest}</p>}
        </div>

        {/* Comparación */}
        <div className="space-y-2.5">
          <span className="eyebrow">Comparación</span>
          <div className="space-y-0">
            {rows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between border-b border-white/[0.05] py-2 last:border-0"
              >
                <span className="text-[12px] text-[#8B93A7]">{r.label}</span>
                <span
                  className="text-[13px] font-semibold tabular-nums"
                  style={{ color: r.accent ?? '#F5F7FA' }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Por qué esta ruta */}
        {(donde || que || cuando) && (
          <div className="space-y-2.5">
            <span className="eyebrow">Por qué esta ruta</span>
            <div className="space-y-3">
              {donde && (
                <div className="flex items-start gap-2.5">
                  <ShieldAlert size={15} className="mt-0.5 flex-shrink-0 text-[#FF4D4D]" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#F5F7FA]">Cruza zonas con mayor exposición</p>
                    <p className="text-[11px] leading-relaxed text-[#8B93A7]">{donde}</p>
                  </div>
                </div>
              )}
              {que && (
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[#F5B82E]" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#F5F7FA]">Tipo de incidente dominante</p>
                    <p className="text-[11px] leading-relaxed text-[#8B93A7]">{que}</p>
                  </div>
                </div>
              )}
              {cuando && (
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="mt-0.5 flex-shrink-0 text-[#8B93A7]" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#F5F7FA]">Franja de mayor riesgo</p>
                    <p className="text-[11px] leading-relaxed text-[#8B93A7]">{cuando}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/[0.07] p-4">
        <button
          type="button"
          onClick={() => riskiest && setFocusPoint(riskiest)}
          className="flex w-full items-center justify-between rounded-none border border-white/[0.1] bg-white/[0.03] px-4 py-3 text-[13px] font-semibold text-[#F5F7FA] transition hover:bg-white/[0.06]"
        >
          Ver recorrido paso a paso
          <ChevronRight size={16} className="text-[#8B93A7]" />
        </button>
      </div>
    </aside>
  )
}
