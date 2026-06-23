interface Props {
  values: number[] // 0..1
  color: string
  width?: number
  height?: number
}

/** Mini-gráfico de riesgo por tramo. Decorativo-informativo. */
export default function Sparkline({ values, color, width = 150, height = 30 }: Props) {
  if (values.length < 2) {
    return (
      <svg width={width} height={height} className="block">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.7}
        />
      </svg>
    )
  }

  const max = Math.max(...values, 0.001)
  const stepX = width / (values.length - 1)
  const pad = 3
  const usable = height - pad * 2
  const points = values.map((v, i) => {
    const x = i * stepX
    const y = pad + usable - (v / max) * usable
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <svg width={width} height={height} className="block">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
