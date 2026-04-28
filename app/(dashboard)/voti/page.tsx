'use client'

import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { SubjectRow } from '@/app/components/features/SubjectRow'
import { AverageCircle } from '@/app/components/features/AverageCircle'
import { Grade, computeAverage, computeGradeNeeded, getAverageColorVsObjective, isValidGrade } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'

export default function VotiPage() {
  const { settings, ready } = useSettings()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<number | 'latest' | 'general'>('latest')

  useEffect(() => {
    fetch('/api/grades')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setGrades(data.grades)
      })
      .catch(() => setError('Errore di rete'))
      .finally(() => setLoading(false))
  }, [])

  const periods = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of grades) map.set(g.periodPos, g.periodDesc)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [grades])

  // Set default period to first available
  useEffect(() => {
    if (period === 'latest' && periods.length > 0) {
      // keep latest as default, fine
    }
  }, [periods, period])

  const tabs = useMemo(() => [
    { id: 'latest' as const, label: 'Ultimi voti' },
    ...periods.map(([id, desc]) => ({ id: id as number, label: desc })),
    { id: 'general' as const, label: 'Generale' },
  ], [periods])

  const filteredGrades = useMemo(() => {
    if (period === 'latest') return grades
    if (period === 'general') return grades
    return grades.filter(g => g.periodPos === period)
  }, [grades, period])

  const overallAverage = useMemo(() =>
    computeAverage(filteredGrades, settings.useWeightedAverage),
    [filteredGrades, settings.useWeightedAverage]
  )

  const chartData = useMemo(() => {
    const valid = [...filteredGrades]
      .filter(isValidGrade)
      .sort((a, b) => a.evtDate.localeCompare(b.evtDate))
    let total = 0
    return valid.map((g, i) => {
      total += g.decimalValue ?? 0
      return { media: parseFloat((total / (i + 1)).toFixed(2)) }
    })
  }, [filteredGrades])

  const subjects = useMemo(() => {
    const gradesForSubjects = period === 'latest' && periods.length > 0
      ? grades.filter(g => g.periodPos === periods[0][0])
      : filteredGrades

    const group = new Map<number, Grade[]>()
    gradesForSubjects.forEach(g => {
      const existing = group.get(g.subjectId) ?? []
      existing.push(g)
      group.set(g.subjectId, existing)
    })

    return [...group.entries()]
      .map(([subjectId, subGrades]) => {
        const avg = computeAverage(subGrades, settings.useWeightedAverage)
        const objective = settings.objectives[String(subjectId)] ?? settings.objective
        return {
          subjectId,
          subjectDesc: subGrades[0].subjectDesc,
          average: avg,
          objective,
          gradeNeeded: computeGradeNeeded(objective, avg ?? Number.NaN, subGrades.filter(isValidGrade).length),
          averageVariant: getAverageColorVsObjective(avg, objective),
        }
      })
      .sort((a, b) => {
        const av = a.average ?? -1
        const bv = b.average ?? -1
        return settings.sortAscending ? av - bv : bv - av
      })
  }, [grades, filteredGrades, period, periods, settings])

  const latestGrades = useMemo(() =>
    [...grades]
      .filter(isValidGrade)
      .sort((a, b) => b.evtDate.localeCompare(a.evtDate))
      .slice(0, 20),
    [grades]
  )

  if (loading || !ready) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }}>Voti</h1>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={String(tab.id)}
            onClick={() => setPeriod(tab.id as number | 'latest' | 'general')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              background: period === tab.id ? 'var(--red)' : 'var(--surface)',
              color: period === tab.id ? '#fff' : 'var(--text-2)',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overall average card */}
      {period !== 'latest' && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AverageCircle label="Media" value={overallAverage} size={90} />
          </div>
          <div style={{ flex: 1, height: '80px' }}>
            {chartData.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <YAxis domain={[4, 10]} hide />
                  <Line
                    type="monotone"
                    dataKey="media"
                    stroke="var(--red)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Latest grades list */}
      {period === 'latest' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {latestGrades.map(grade => (
            <LatestGradeRow key={grade.evtId} grade={grade} />
          ))}
        </div>
      ) : (
        /* Subject list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subjects.map(subject => (
            <SubjectRow
              key={subject.subjectId}
              subjectId={subject.subjectId}
              subjectDesc={subject.subjectDesc}
              average={subject.average}
              averageVariant={subject.averageVariant}
              needed={subject.gradeNeeded}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function getGradeCardColor(grade: Grade): string {
  if (grade.cancelled) return 'var(--surface-3)'
  if (grade.decimalValue === null || grade.decimalValue === -1) return '#1565c0'
  if (grade.decimalValue >= 6) return '#2e7d32'
  return '#c62828'
}

function LatestGradeRow({ grade }: { grade: Grade }) {
  const bgColor = getGradeCardColor(grade)
  const display = grade.displayValue || String(grade.decimalValue)

  return (
    <div style={{
      background: bgColor,
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{
        width: '48px', height: '48px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: bgColor }}>{display}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#fff' }}>
          {grade.subjectDesc}{grade.componentDesc ? ` - ${grade.componentDesc}` : ''}
        </p>
        {grade.notesForFamily && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {grade.notesForFamily}
          </p>
        )}
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
          {grade.evtDate.split('-').reverse().join(' ').replace(/(\d+) (\d+) (\d+)/, (_, d, m, y) => {
            const months = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre']
            return `${d} ${months[parseInt(m)-1]} ${y}`
          })}
        </p>
      </div>
    </div>
  )
}
