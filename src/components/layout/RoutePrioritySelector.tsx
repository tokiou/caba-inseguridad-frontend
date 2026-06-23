import { Zap, Scale, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useRouteStore } from '@/store/routeStore'
import type { RouteKind } from '@/types/route'

const OPTIONS: { value: RouteKind; label: string; desc: string; Icon: LucideIcon }[] = [
  { value: 'fastest', label: 'Más rápida', desc: 'Menor tiempo de viaje', Icon: Zap },
  { value: 'balanced', label: 'Balanceada', desc: 'Equilibrio entre tiempo y seguridad', Icon: Scale },
  { value: 'safest', label: 'Más segura', desc: 'Prioriza evitar zonas de riesgo', Icon: ShieldCheck },
]

export default function RoutePrioritySelector() {
  const { selectedKind, setSelectedKind, response } = useRouteStore()
  const available = new Set(response?.routes.map((r) => r.kind))

  return (
    <div className="space-y-2">
      <span className="eyebrow">Prioridad de la ruta</span>
      <div className="space-y-1.5">
        {OPTIONS.map(({ value, label, desc, Icon }) => {
          const selected = selectedKind === value
          const disabled = Boolean(response) && !available.has(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedKind(value)}
              disabled={disabled}
              aria-pressed={selected}
              className="flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                borderColor: selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.07)',
                background: selected ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
              }}
            >
              <Icon
                size={16}
                className="flex-shrink-0"
                style={{ color: selected ? '#F5F7FA' : '#8B93A7' }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-[#F5F7FA]">{label}</span>
                <span className="block truncate text-[11px] text-[#6e7689]">{desc}</span>
              </span>
              <span
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: selected ? '#F5F7FA' : 'rgba(255,255,255,0.2)' }}
              >
                {selected && <span className="h-2 w-2 rounded-full" style={{ background: '#F5F7FA' }} />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
