import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, Layers, ChevronDown, LogOut } from 'lucide-react'
import AddressAutocomplete from '@/components/route/AddressAutocomplete'
import MapLayersList from './MapLayersList'
import { useAuth } from '@/hooks/useAuth'
import { useRouteStore } from '@/store/routeStore'
import { useUIStore } from '@/store/uiStore'
import type { AddressSuggestion } from '@/types/map'

export default function TopBar() {
  const setFocusPoint = useRouteStore((s) => s.setFocusPoint)
  const { basemap, toggleBasemap } = useUIStore()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [layersOpen, setLayersOpen] = useState(false)
  const layersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!layersRef.current?.contains(e.target as Node)) setLayersOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleSelect(s: AddressSuggestion) {
    setFocusPoint({ lat: parseFloat(s.lat), lng: parseFloat(s.lon) })
    setQuery(s.display_name.split(',').slice(0, 2).join(',').trim())
  }

  const isDark = basemap === 'dark'

  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center gap-3 p-4">
      <div className="pointer-events-auto w-full max-w-[420px]">
        <AddressAutocomplete
          placeholder="Buscar barrio, calle o lugar..."
          value={query}
          onChange={setQuery}
          onSelect={handleSelect}
          clearable
        />
      </div>

      <div className="pointer-events-auto ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={toggleBasemap}
          className="flex h-11 items-center gap-2 rounded-none border border-white/[0.08] bg-[#14161c]/90 px-3.5 text-sm font-medium text-[#C7CDDA] backdrop-blur-md transition hover:border-white/20"
          title="Cambiar tema del mapa"
        >
          {isDark ? <Moon size={15} className="text-[#8B93A7]" /> : <Sun size={15} className="text-[#C7CDDA]" />}
          {isDark ? 'Noche' : 'Día'}
        </button>

        <div ref={layersRef} className="relative">
          <button
            type="button"
            onClick={() => setLayersOpen((o) => !o)}
            aria-expanded={layersOpen}
            className="flex h-11 items-center gap-2 rounded-none border border-white/[0.08] bg-[#14161c]/90 px-3.5 text-sm font-medium text-[#C7CDDA] backdrop-blur-md transition hover:border-white/20"
          >
            <Layers size={15} className="text-[#8B93A7]" />
            Capas
            <ChevronDown
              size={14}
              className={`text-[#6e7689] transition-transform ${layersOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {layersOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-none border border-white/[0.08] bg-[#14161c] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              <MapLayersList />
            </div>
          )}
        </div>

        {user && (
          <div className="flex h-11 items-center gap-2 border border-white/[0.08] bg-[#14161c]/90 pl-3.5 pr-1.5 text-sm text-[#C7CDDA] backdrop-blur-md">
            <span className="max-w-[160px] truncate text-[#8B93A7]" title={user.email}>
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex h-8 w-8 items-center justify-center text-[#8B93A7] transition hover:text-[#F5556B]"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
