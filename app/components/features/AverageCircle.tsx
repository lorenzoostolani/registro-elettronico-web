export function AverageCircle({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r="38" fill="none" stroke="var(--border)" strokeWidth="10" />
        <text x="44" y="49" textAnchor="middle" className="fill-[var(--text)] text-base font-bold">
          {value === null ? '—' : value.toFixed(2)}
        </text>
      </svg>
      <p className="text-xs text-text2">{label}</p>
    </div>
  )
}
