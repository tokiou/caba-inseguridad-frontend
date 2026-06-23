import { Info } from 'lucide-react'
import { useRouteStore } from '@/store/routeStore'

export default function RiskExplanation() {
  const { response } = useRouteStore()
  if (!response) return null

  return (
    <div className="hairline animate-slide-up pt-5">
      <div className="mb-2 flex items-center gap-2">
        <Info size={13} style={{ color: '#F5B82E' }} />
        <span className="eyebrow">Cómo leer esto</span>
      </div>
      <p className="text-xs leading-relaxed text-[#8B93A7]">
        Mostramos <span className="font-medium text-[#F5F7FA]">exposición histórica estimada al
        delito</span>, no una garantía de seguridad. Las métricas de delitos son intensidad relativa
        para comparar rutas entre sí, no un conteo de hechos en tu trayecto.
      </p>
      <p className="mt-2 text-[10px] text-[#626B7F]">
        Modelo: {response.model_version.name} · datos hasta {response.model_version.train_until}
      </p>
    </div>
  )
}
