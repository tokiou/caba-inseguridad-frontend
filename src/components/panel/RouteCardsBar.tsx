import { ArrowRight } from 'lucide-react'
import RouteCard from './RouteCard'
import { useRouteStore } from '@/store/routeStore'
import { useUIStore } from '@/store/uiStore'
import type { RouteKind, SafeRoute } from '@/types/route'

// Orden de las tarjetas inferiores (el contraste least_safe_candidate no se lista aquí).
const CARD_ORDER: RouteKind[] = ['fastest', 'balanced', 'safest']

export default function RouteCardsBar() {
  const { response, selectedKind, setSelectedKind } = useRouteStore()
  const setDetailOpen = useUIStore((s) => s.setDetailOpen)
  if (!response) return null

  const routes = CARD_ORDER.map((kind) => response.routes.find((r) => r.kind === kind)).filter(
    (r): r is SafeRoute => Boolean(r),
  )
  if (!routes.length) return null

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center gap-2 p-4">
      <div className="pointer-events-auto flex w-full max-w-[860px] items-stretch gap-3">
        {routes.map((route) => (
          <RouteCard
            key={route.kind}
            route={route}
            selected={route.kind === selectedKind}
            onSelect={() => setSelectedKind(route.kind)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDetailOpen(true)}
        className="pointer-events-auto flex items-center gap-1.5 rounded-none bg-[#14161c]/90 px-3.5 py-1.5 text-xs font-medium text-[#C7CDDA] backdrop-blur-md transition hover:text-white"
      >
        Ver detalle de las rutas
        <ArrowRight size={13} />
      </button>
    </div>
  )
}
