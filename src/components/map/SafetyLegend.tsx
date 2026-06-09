const LEVELS = [
  { label: 'Seguro', color: '#22c55e' },
  { label: 'Moderado', color: '#f59e0b' },
  { label: 'Peligroso', color: '#ef4444' },
  { label: 'Sin datos', color: '#6b7280' },
]

export default function SafetyLegend() {
  return (
    <div className="absolute bottom-8 left-4 rounded-xl border border-white/10 bg-[#1a1d27]/90 px-4 py-3 backdrop-blur-sm">
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        Nivel de seguridad
      </p>
      <div className="flex flex-col gap-2">
        {LEVELS.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span
              className="h-3 w-3 flex-shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-white/80">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
