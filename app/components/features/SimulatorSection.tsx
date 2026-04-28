'use client'

import { useState } from 'react'
import { GradeType } from '@/lib/domain/grades/entities'
import { LocalGrade } from '@/lib/hooks/useLocalGrades'

export function SimulatorSection({
  localGrades,
  addGrade,
  updateGrade,
  removeGrade,
  recalculatedAverage,
}: {
  localGrades: LocalGrade[]
  addGrade: (v: number, type: GradeType, weightPercent: number) => void
  updateGrade: (id: string, patch: Partial<Pick<LocalGrade, 'type' | 'weightPercent'>>) => void
  removeGrade: (id: string) => void
  recalculatedAverage: number | null
}) {
  const [value, setValue] = useState('6')
  const [type, setType] = useState<GradeType>('Scritto')

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        background: 'var(--surface-2)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Simulatore voti
        </span>
        <span style={{ fontSize: '13px', color: 'var(--text-2)' }}>
          Media ricalcolata: <strong style={{ color: 'var(--text)' }}>{recalculatedAverage?.toFixed(2) ?? '—'}</strong>
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: localGrades.length > 0 ? '12px' : 0,
          border: '1px solid var(--border)',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>
            Aggiungi un voto simulato
          </p>
          <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr auto' }}>
            <input type="number" min={1} max={10} step={0.25} value={value} onChange={e => setValue(e.target.value)} style={inputStyle} />
            <select value={type} onChange={e => setType(e.target.value as GradeType)} style={inputStyle}>
              <option value="Scritto">Scritto</option>
              <option value="Orale">Orale</option>
              <option value="Pratico">Pratico</option>
            </select>
            <button
              onClick={() => {
                const n = Number(value)
                if (!Number.isNaN(n) && n >= 1 && n <= 10) {
                  addGrade(n, type, 100)
                }
              }}
              style={buttonStyle}
            >
              + Aggiungi
            </button>
          </div>
        </div>

        {localGrades.length > 0 && (
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
              Voti simulati ({localGrades.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {localGrades.map(grade => (
                <div key={grade.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {grade.value % 1 === 0 ? grade.value : grade.value.toFixed(2)}
                    </span>
                    <span style={{ color: 'var(--text-2)', fontSize: '12px' }}>{grade.type}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                      Peso %{' '}
                      <input
                        type="number"
                        min={1}
                        max={300}
                        step={5}
                        value={Math.round(grade.weightPercent)}
                        onChange={(event) => {
                          const next = Number(event.target.value)
                          if (!Number.isNaN(next) && next >= 1 && next <= 300) updateGrade(grade.id, { weightPercent: next })
                        }}
                        style={{ ...inputStyle, width: '68px', padding: '4px 6px' }}
                      />
                    </label>
                    <button onClick={() => removeGrade(grade.id)} style={removeStyle}>Rimuovi</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--surface)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontSize: '14px',
}

const buttonStyle: React.CSSProperties = {
  padding: '9px 18px',
  background: 'var(--red)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
}

const removeStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-3)',
  fontSize: '12px',
  fontWeight: 600,
}
