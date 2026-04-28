interface AverageCircleProps {
  label: string
  value: number | null
  size?: number
}

function getColor(value: number | null): string {
  if (value === null) return 'var(--border-strong)'
  if (value >= 6) return 'var(--green)'
  if (value >= 5) return 'var(--amber)'
  return 'var(--red)'
}

export function AverageCircle({ label, value, size = 88 }: AverageCircleProps) {
  const r = size * 0.43
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const stroke = size * 0.115
  const progress = value === null ? 0 : Math.min(value / 10, 1)
  const dashOffset = circumference * (1 - progress)
  const color = getColor(value)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* background ring */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={stroke}
        />
        {/* progress ring */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
        {/* text — rotated back */}
        <text
          x={cx} y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--text)"
          fontSize={size * 0.18}
          fontWeight="700"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${cx}px ${cy}px` }}
        >
          {value === null ? '—' : value % 1 === 0 ? value.toFixed(2) : value.toFixed(2)}
        </text>
      </svg>
      <p style={{ fontSize: '13px', color: 'var(--text-2)', margin: 0 }}>{label}</p>
    </div>
  )
}
