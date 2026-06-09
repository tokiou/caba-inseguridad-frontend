import { ArrowUpDown, Search } from 'lucide-react'
import { useState } from 'react'
import AddressAutocomplete from './AddressAutocomplete'
import TimePicker from './TimePicker'
import { useRouteStore } from '@/store/routeStore'
import type { AddressSuggestion } from '@/types/map'

interface Props {
  onSearch: () => void
  isLoading: boolean
}

export default function RouteSearchForm({ onSearch, isLoading }: Props) {
  const { origin, destination, setOrigin, setDestination } = useRouteStore()
  const [originLabel, setOriginLabel] = useState(origin?.label ?? '')
  const [destLabel, setDestLabel] = useState(destination?.label ?? '')

  function handleSwap() {
    if (!origin || !destination) return
    const tmpLabel = originLabel
    setOriginLabel(destLabel)
    setDestLabel(tmpLabel)
    setOrigin({ display_name: destination.label, lat: String(destination.lat), lon: String(destination.lng), place_id: 0 })
    setDestination({ display_name: origin.label, lat: String(origin.lat), lon: String(origin.lng), place_id: 0 })
  }

  function handleSelectOrigin(s: AddressSuggestion) {
    setOrigin(s)
    setOriginLabel(s.display_name.split(',').slice(0, 2).join(',').trim())
  }

  function handleSelectDestination(s: AddressSuggestion) {
    setDestination(s)
    setDestLabel(s.display_name.split(',').slice(0, 2).join(',').trim())
  }

  const canSearch = Boolean(origin && destination)

  return (
    <div className="space-y-3">
      <div className="relative space-y-2">
        <AddressAutocomplete
          placeholder="Desde... (origen)"
          value={originLabel}
          onChange={setOriginLabel}
          onSelect={handleSelectOrigin}
          iconColor="#22c55e"
        />

        <button
          type="button"
          onClick={handleSwap}
          disabled={!origin || !destination}
          className="absolute -bottom-[18px] right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1a1d27] text-white/40 transition hover:border-white/20 hover:text-white/70 disabled:pointer-events-none disabled:opacity-30"
          title="Intercambiar origen y destino"
        >
          <ArrowUpDown size={14} />
        </button>

        <AddressAutocomplete
          placeholder="Hasta... (destino)"
          value={destLabel}
          onChange={setDestLabel}
          onSelect={handleSelectDestination}
          iconColor="#ef4444"
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <TimePicker />
      </div>

      <button
        type="button"
        onClick={onSearch}
        disabled={!canSearch || isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-[#0f1117] transition hover:bg-white/90 disabled:pointer-events-none disabled:opacity-30"
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1117]/30 border-t-[#0f1117]" />
        ) : (
          <Search size={15} />
        )}
        {isLoading ? 'Calculando ruta...' : 'Buscar ruta segura'}
      </button>
    </div>
  )
}
