import { Clock } from 'lucide-react'
import { useRouteStore } from '@/store/routeStore'

export default function TimePicker() {
  const { hour, setHour } = useRouteStore()

  const formatted = `${String(hour).padStart(2, '0')}:00`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/50">
          <Clock size={14} />
          <span className="text-xs">Horario de viaje</span>
        </div>
        <span className="text-sm font-semibold text-white">{formatted}</span>
      </div>
      <input
        type="range"
        min={0}
        max={23}
        value={hour}
        onChange={(e) => setHour(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-white/80"
      />
      <div className="flex justify-between text-[10px] text-white/25">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  )
}
