'use client'

import { useState } from 'react'
import { Card } from '@/app/components/ui/Card'
import { LocalGrade } from '@/lib/hooks/useLocalGrades'

export function SimulatorSection({
  localGrades,
  addGrade,
  removeGrade,
  realAverage,
  simulatedAverage
}: {
  localGrades: LocalGrade[]
  addGrade: (v: number) => void
  removeGrade: (id: string) => void
  realAverage: number | null
  simulatedAverage: number | null
}) {
  const [value, setValue] = useState('6')

  const delta = realAverage !== null && simulatedAverage !== null ? simulatedAverage - realAverage : null

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Simulatore voti ipotetici</h3>
      <div className="mb-3 flex gap-2">
        <input
          type="number"
          min={1}
          max={10}
          step={0.25}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-28 rounded-lg border border-borderToken px-3 py-2"
        />
        <button
          className="rounded-lg bg-blueToken px-3 py-2 text-white"
          onClick={() => {
            const n = Number(value)
            if (!Number.isNaN(n) && n >= 1 && n <= 10) addGrade(n)
          }}
        >
          Aggiungi
        </button>
      </div>
      <p className="text-sm">
        Differenza:{' '}
        <span className={delta === null ? 'text-text2' : delta > 0 ? 'text-[var(--green)]' : delta < 0 ? 'text-[var(--red)]' : 'text-text2'}>
          {delta === null ? '—' : delta > 0 ? `↑ ${delta.toFixed(2)}` : delta < 0 ? `↓ ${Math.abs(delta).toFixed(2)}` : '= 0'}
        </span>
      </p>
      <ul className="mt-3 space-y-2">
        {localGrades.map((grade) => (
          <li key={grade.id} className="flex items-center justify-between rounded-lg border border-borderToken px-3 py-2 text-sm">
            <span>{grade.value.toFixed(2)}</span>
            <button className="text-[var(--red)]" onClick={() => removeGrade(grade.id)}>
              Rimuovi
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
