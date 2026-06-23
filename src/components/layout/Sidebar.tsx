import { useState } from 'react'
import { Menu, Search, MapPin } from 'lucide-react'
import AddressAutocomplete from '@/components/route/AddressAutocomplete'
import RoutePrioritySelector from './RoutePrioritySelector'
import MapLayersList from './MapLayersList'
import { useRouteStore } from '@/store/routeStore'
import { messageForError } from '@/services/routeService'
import type { AddressSuggestion } from '@/types/map'

interface Props {
  onSearch: () => void
  isLoading: boolean
  isError: boolean
  error: unknown
}

function shortLabel(name: string) {
  return name.split(',').slice(0, 2).join(',').trim()
}

export default function Sidebar({ onSearch, isLoading, isError, error }: Props) {
  const { origin, destination, setOrigin, setDestination } = useRouteStore()
  const [originLabel, setOriginLabel] = useState(origin?.label ? shortLabel(origin.label) : '')
  const [destLabel, setDestLabel] = useState(destination?.label ? shortLabel(destination.label) : '')

  function handleSelectOrigin(s: AddressSuggestion) {
    setOrigin(s)
    setOriginLabel(shortLabel(s.display_name))
  }
  function handleSelectDestination(s: AddressSuggestion) {
    setDestination(s)
    setDestLabel(shortLabel(s.display_name))
  }

  const canSearch = Boolean(origin && destination)

  return (
    <aside className="flex h-full w-[288px] flex-shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0b0e]">
      {/* Marca */}
      <div className="flex items-start justify-between px-5 pb-4 pt-5">
        <div>
          <h1 className="text-[17px] font-bold tracking-tight text-[#F5F7FA]">Rutas Seguras</h1>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-[#6e7689]">CABA</p>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-none text-[#8B93A7] transition hover:bg-white/[0.06] hover:text-[#F5F7FA]"
          title="Menú"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Contenido scrolleable */}
      <div className="panel-scroll flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-4">
        <div className="space-y-1.5">
          <span className="eyebrow">Origen</span>
          <AddressAutocomplete
            placeholder="Buscar origen..."
            value={originLabel}
            onChange={setOriginLabel}
            onSelect={handleSelectOrigin}
            clearable
            leadingIcon={
              <span
                className="h-2.5 w-2.5 rounded-full ring-[3px] ring-white/10"
                style={{ background: '#F5F7FA' }}
              />
            }
          />
        </div>

        <div className="space-y-1.5">
          <span className="eyebrow">Destino</span>
          <AddressAutocomplete
            placeholder="Buscar destino..."
            value={destLabel}
            onChange={setDestLabel}
            onSelect={handleSelectDestination}
            clearable
            leadingIcon={<MapPin size={15} className="text-[#8B93A7]" />}
          />
        </div>

        <RoutePrioritySelector />

        <button
          type="button"
          onClick={onSearch}
          disabled={!canSearch || isLoading}
          className="btn-primary flex h-11 w-full items-center justify-center gap-2 rounded-none text-sm"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#07110D]/30 border-t-[#07110D]" />
          ) : (
            <Search size={15} />
          )}
          {isLoading ? 'Calculando...' : 'Buscar rutas'}
        </button>

        {isError && (
          <div className="rounded-none bg-[#FF4D4D]/[0.08] px-3.5 py-2.5">
            <p className="text-xs text-[#ff8585]">{messageForError(error)}</p>
          </div>
        )}

        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <span className="eyebrow">Capas del mapa</span>
          <MapLayersList />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-5 py-4">
        <p className="text-[10px] leading-relaxed text-[#5a6173]">
          Los niveles muestran exposición histórica estimada al delito, sin garantías de seguridad.
        </p>
        <p className="mt-1.5 text-[10px] text-[#4a5260]">Fuente: GCBA</p>
      </div>
    </aside>
  )
}
