import { MapPin, ShieldAlert, Clock } from 'lucide-react'
import { useRouteStore } from '@/store/routeStore'
import { RISK_COLORS } from '@/utils/safetyColors'
import { BUCKET_SHORT } from '@/utils/routeKind'
import { dondePhrase, quePhrase, cuandoPhrase } from '@/utils/routeExplain'
import { formatExposurePercent } from '@/utils/formatStats'
import type { TimeBucket } from '@/types/route'

const BUCKETS: TimeBucket[] = ['morning', 'afternoon', 'evening', 'night']

export default function RouteExplainer() {
  const { response, selectedKind, routeByKind, setFocusPoint } = useRouteStore()
  if (!response) return null

  const route = routeByKind(selectedKind) ?? response.routes[0]
  if (!route) return null

  const donde = dondePhrase(route)
  const que = quePhrase(route)
  const cuando = cuandoPhrase(route)
  const tod = route.time_of_day_risk
  const point = route.riskiest_segment?.point

  if (!donde && !que && !cuando && !tod) return null

  return (
    <div className="hairline animate-slide-up space-y-3 pt-5">
      <span className="eyebrow">Por qué</span>

      <div className="space-y-2.5">
        {donde && (
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#FF4D4D]" />
            <p className="text-xs leading-relaxed text-[#8B93A7]">
              {donde}
              {point && (
                <>
                  {' '}
                  <button
                    type="button"
                    onClick={() => setFocusPoint(point)}
                    className="font-medium text-[#F5F7FA] underline-offset-2 transition hover:underline"
                  >
                    Ver en el mapa
                  </button>
                </>
              )}
            </p>
          </div>
        )}

        {que && (
          <div className="flex items-start gap-2.5">
            <ShieldAlert size={14} className="mt-0.5 flex-shrink-0 text-[#F5B82E]" />
            <p className="text-xs leading-relaxed text-[#8B93A7]">{que}</p>
          </div>
        )}

        {cuando && (
          <div className="flex items-start gap-2.5">
            <Clock size={14} className="mt-0.5 flex-shrink-0 text-[#8B93A7]" />
            <p className="text-xs leading-relaxed text-[#8B93A7]">{cuando}</p>
          </div>
        )}
      </div>

      {tod && (
        <div className="flex items-end gap-2 pt-1">
          {BUCKETS.map((b) => {
            const br = tod[b]
            const color = RISK_COLORS[br.risk_level]
            const peak = tod.peak_bucket === b
            const height = Math.max(8, formatExposurePercent(br.risk_score))
            return (
              <div key={b} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-12 w-full items-end overflow-hidden rounded-none bg-white/[0.05]">
                  <div
                    className="w-full rounded-none transition-[height] duration-500"
                    style={{ height: `${height}%`, background: color, opacity: peak ? 1 : 0.45 }}
                  />
                </div>
                <span
                  className={`text-[9px] ${peak ? 'font-semibold text-[#F5F7FA]' : 'text-[#6e7689]'}`}
                >
                  {BUCKET_SHORT[b]}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
