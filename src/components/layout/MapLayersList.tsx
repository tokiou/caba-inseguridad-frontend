import { TriangleAlert, ShoppingBag, Bus, Cctv } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useUIStore, type LayerKey } from '@/store/uiStore'

const LAYERS: { key: LayerKey; label: string; desc: string; Icon: LucideIcon }[] = [
  { key: 'risk_zones', label: 'Zonas de riesgo', desc: 'Áreas con mayor exposición delictiva', Icon: TriangleAlert },
  { key: 'robberies', label: 'Robos y hurtos', desc: 'Denuncias últimas 24 hs', Icon: ShoppingBag },
  { key: 'transit', label: 'Transporte público', desc: 'Estaciones y paradas', Icon: Bus },
  { key: 'cameras', label: 'Cámaras de seguridad', desc: 'Puntos de monitoreo', Icon: Cctv },
]

export default function MapLayersList() {
  const { layers, toggleLayer } = useUIStore()

  return (
    <div className="space-y-0.5">
      {LAYERS.map(({ key, label, desc, Icon }) => {
        const on = layers[key]
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggleLayer(key)}
            aria-pressed={on}
            className="flex w-full items-center gap-3 rounded-none px-1 py-2 text-left transition hover:bg-white/[0.03]"
          >
            <Icon size={16} className="flex-shrink-0" style={{ color: on ? '#F5F7FA' : '#6e7689' }} />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] text-[#C7CDDA]">{label}</span>
              <span className="block truncate text-[11px] text-[#6e7689]">{desc}</span>
            </span>
            <span
              className="relative h-[18px] w-[32px] flex-shrink-0 rounded-full transition-colors"
              style={{ background: on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.12)' }}
            >
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-[left]"
                style={{ left: on ? 16 : 2, background: on ? '#0a0b0e' : '#f5f7fa' }}
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
