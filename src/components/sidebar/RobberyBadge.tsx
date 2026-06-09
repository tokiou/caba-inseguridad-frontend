interface Props {
  count: number
  label: string
  icon: React.ReactNode
  color?: string
}

export default function RobberyBadge({ count, label, icon, color = '#ef4444' }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3.5 py-3">
      <span className="flex-shrink-0" style={{ color }}>
        {icon}
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-white">{count}</p>
        <p className="mt-0.5 text-xs text-white/40">{label}</p>
      </div>
    </div>
  )
}
