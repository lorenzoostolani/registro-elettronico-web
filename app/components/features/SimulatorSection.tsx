'use client'

import { useState } from 'react'
import { LocalGrade } from '@/lib/hooks/useLocalGrades'

export function SimulatorSection({
  localGrades,
  addGrade,
  removeGrade,
  realAverage,
  simulatedAverage,
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
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '16px',
    }}>
      {/* Header row with averages */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span style={{ fontSize: '15px', fontWeight: 600 }}>{realAverage?.toFixed(2) ?? '—'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {delta === null ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          ) : delta > 0 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          )}
          <span style={{
            fontSize: '15px', fontWeight: 600,
            color: delta === null ? 'var(--text-2)' : delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--text-2)',
          }}>
            {delta === null ? '0.00' : Math.abs(delta).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Empty state or grade list */}
      {localGrades.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '6px' }}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <p style={{ margin: 0, fontSize: '13px' }}>Ancora nessun voto</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          {localGrades.map(grade => (
            <div key={grade.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 12px',
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
            }}>
              <span>{grade.value.toFixed(2)}</span>
              <button onClick={() => removeGrade(grade.id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--red)', fontSize: '13px', fontWeight: 600,
              }}>Rimuovi</button>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <input
          type="number" min={1} max={10} step={0.25}
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            width: '70px', padding: '7px 10px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text)', fontSize: '14px',
            textAlign: 'center',
          }}
        />
        <button
          onClick={() => {
            const n = Number(value)
            if (!Number.isNaN(n) && n >= 1 && n <= 10) addGrade(n)
          }}
          style={{
            padding: '7px 16px',
            background: 'none', border: 'none',
            color: 'var(--text)', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          AGGIUNGI
        </button>
      </div>
    </div>
  )
}
