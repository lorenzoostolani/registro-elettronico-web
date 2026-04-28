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
  const hasSimulatedGrades = localGrades.length > 0

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Section header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--surface-2)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Simulatore voti
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Average comparison */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <div style={{
            flex: 1,
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            border: '1px solid var(--border)',
          }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>MEDIA REALE</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
              {realAverage?.toFixed(2) ?? '—'}
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-3)', fontSize: '18px',
          }}>→</div>

          <div style={{
            flex: 1,
            background: hasSimulatedGrades ? 'rgba(76,175,80,0.08)' : 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            border: `1px solid ${hasSimulatedGrades ? 'rgba(76,175,80,0.3)' : 'var(--border)'}`,
            transition: 'all 0.2s',
          }}>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-3)', fontWeight: 500, marginBottom: '4px' }}>MEDIA SIMULATA</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <p style={{
                margin: 0, fontSize: '20px', fontWeight: 700,
                color: delta === null ? 'var(--text)' : delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--text)',
              }}>
                {hasSimulatedGrades ? (simulatedAverage?.toFixed(2) ?? '—') : '—'}
              </p>
              {delta !== null && hasSimulatedGrades && (
                <span style={{
                  fontSize: '12px', fontWeight: 600,
                  color: delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--text-3)',
                }}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add a simulated grade */}
        <div style={{
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          marginBottom: localGrades.length > 0 ? '12px' : 0,
          border: '1px solid var(--border)',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--text-2)', fontWeight: 500 }}>
            Aggiungi un voto ipotetico
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="number" min={1} max={10} step={0.25}
                value={value}
                onChange={e => setValue(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text)', fontSize: '15px',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              />
            </div>
            <button
              onClick={() => {
                const n = Number(value)
                if (!Number.isNaN(n) && n >= 1 && n <= 10) addGrade(n)
              }}
              style={{
                padding: '9px 18px',
                background: 'var(--red)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              + Aggiungi
            </button>
          </div>
        </div>

        {/* List of simulated grades */}
        {localGrades.length > 0 && (
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>
              Voti ipotetici aggiunti ({localGrades.length})
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
                    <span style={{
                      width: '32px', height: '32px',
                      borderRadius: '50%',
                      background: grade.value >= 6 ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                      border: `1px solid ${grade.value >= 6 ? 'rgba(76,175,80,0.4)' : 'rgba(244,67,54,0.4)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '13px',
                      color: grade.value >= 6 ? 'var(--green)' : 'var(--red)',
                    }}>
                      {grade.value % 1 === 0 ? grade.value : grade.value.toFixed(2)}
                    </span>
                    <span style={{ color: 'var(--text-2)', fontSize: '12px' }}>Voto ipotetico</span>
                  </div>
                  <button onClick={() => removeGrade(grade.id)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-3)', fontSize: '12px', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '4px 6px', borderRadius: '4px',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
