import { useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'
import RouteSearchForm from '@/components/route/RouteSearchForm'
import RouteStats from './RouteStats'
import { useRoute } from '@/hooks/useRoute'
import { useRouteStore } from '@/store/routeStore'

export default function Sidebar() {
  const { data, isFetching, isError, refetch } = useRoute()
  const { setActiveRoute } = useRouteStore()

  useEffect(() => {
    if (data) setActiveRoute(data)
  }, [data, setActiveRoute])

  return (
    <aside className="flex h-full w-[380px] flex-shrink-0 flex-col border-r border-white/5 bg-[#12141c]">
      <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8">
          <ShieldAlert size={16} className="text-white/70" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">SafeRoute BA</p>
          <p className="text-[10px] text-white/30">Rutas seguras en CABA</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto p-5">
        <RouteSearchForm
          onSearch={() => refetch()}
          isLoading={isFetching}
        />

        {isError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-xs text-red-400">
              No se pudo calcular la ruta. Verificá que el servidor esté activo.
            </p>
          </div>
        )}

        <RouteStats />
      </div>
    </aside>
  )
}
