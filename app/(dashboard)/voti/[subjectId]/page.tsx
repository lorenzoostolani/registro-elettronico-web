'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { AverageCircle } from '@/app/components/features/AverageCircle'
import { GradeCard } from '@/app/components/features/GradeCard'
import { SimulatorSection } from '@/app/components/features/SimulatorSection'
import { Grade, computeAverage, isValidGrade } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'
import { useLocalGrades } from '@/lib/hooks/useLocalGrades'

export default function SubjectDetailPage() {
  const params = useParams<{ subjectId: string }>()
  const router = useRouter()
  const subjectId = Number(params.subjectId)
  const { settings, ready } = useSettings()
  const [allGrades, setAllGrades] = useState<Grade[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/grades')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setAllGrades(data.grades)
      })
      .catch(() => setError('Errore di rete'))
      .finally(() => setLoading(false))
  }, [])

  const subjectGrades = useMemo(
    () => allGrades.filter(g => g.subjectId === subjectId),
    [allGrades, subjectId]
  )

  const periods = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of subjectGrades) map.set(g.periodPos, g.periodDesc)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [subjectGrades])

  useEffect(() => {
    if (period === null && periods.length > 0) setPeriod(periods[0][0])
  }, [period, periods])

  const grades = useMemo(
    () => subjectGrades.filter(g => g.periodPos === period),
    [subjectGrades, period]
  )

  const { grades: localGrades, addGrade, removeGrade } = useLocalGrades(String(subjectId), period ?? 0)

  const average = computeAverage(grades, settings.useWeightedAverage)
  const objective = settings.objectives[String(subjectId)] ?? settings.objective

  const simulatedAverage = useMemo(() => {
    const synthetic = localGrades.map((g, idx) => ({
      subjectId,
      subjectDesc: grades[0]?.subjectDesc ?? '',
      evtId: -1000 - idx,
      evtCode: 'LOCAL',
      evtDate: new Date().toISOString().slice(0, 10),
      decimalValue: g.value,
      displayValue: String(g.value),
      cancelled: false,
      underlined: false,
      periodPos: period ?? 0,
      periodDesc: grades[0]?.periodDesc ?? '',
      componentPos: 0,
      componentDesc: 'Simulazione',
      weightFactor: 1,
      notesForFamily: '',
    })) as Grade[]
    return computeAverage([...grades, ...synthetic], settings.useWeightedAverage)
  }, [grades, localGrades, period, settings.useWeightedAverage, subjectId])

  const typeAverage = (type: string) => {
    // The Spaggiari API uses "Scritto/Grafico" for written grades
    const filter = type === 'Scritto'
      ? grades.filter(g => g.componentDesc === 'Scritto' || g.componentDesc === 'Scritto/Grafico')
      : grades.filter(g => g.componentDesc === type)
    return computeAverage(filter, settings.useWeightedAverage)
  }

  const chartData = useMemo(() => {
    const valid = [...grades].filter(isValidGrade).sort((a, b) => a.evtDate.localeCompare(b.evtDate))
    let total = 0
    return valid.map((g, i) => {
      total += g.decimalValue ?? 0
      return {
        date: g.evtDate,
        voto: g.decimalValue,
        media: parseFloat((total / (i + 1)).toFixed(2)),
      }
    })
  }, [grades])

  const progressPercent = Math.min(100, ((average ?? 0) / objective) * 100)
  const progressColor = (average ?? 0) >= objective ? 'var(--green)' : (average ?? 0) >= objective - 1 ? 'var(--amber)' : 'var(--red)'

  if (loading || !ready) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />

  const subjectName = subjectGrades[0]?.subjectDesc ?? 'Materia'


  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '4px' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{subjectName}</h1>
      </div>

      {/* Period tabs */}
      {periods.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {periods.map(([id, desc]) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                background: period === id ? 'var(--red)' : 'var(--surface)',
                color: period === id ? '#fff' : 'var(--text-2)',
              }}
            >
              {desc}
            </button>
          ))}
        </div>
      )}

      {/* Average circles */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '20px',
        marginBottom: '12px',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
      }}>
        <AverageCircle label="Scritto" value={typeAverage('Scritto')} size={80} />
        <AverageCircle label="Orale" value={typeAverage('Orale')} size={80} />
        <AverageCircle label="Pratico" value={typeAverage('Pratico')} size={80} />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: '16px',
          marginBottom: '12px',
          border: '1px solid var(--border)',
        }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-2)' }}>Media</p>
          <div style={{ height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="mediaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--red)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--red)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <YAxis domain={[4, 10]} hide />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: 'var(--text-2)' }}
                />
                <ReferenceLine y={objective} stroke="var(--red)" strokeDasharray="6 4" strokeWidth={1.5} />
                <Area type="monotone" dataKey="media" stroke="var(--red)" strokeWidth={2} fill="url(#mediaGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Objective progress bar */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid var(--border)',
      }}>
        <div style={{ height: '10px', background: 'var(--surface-3)', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: progressColor,
            borderRadius: '5px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-2)' }}>
          <span>Il tuo obiettivo: {objective}</span>
          <span>La tua media: {average?.toFixed(2) ?? '—'}</span>
        </div>
      </div>

      {/* Simulator */}
      <div style={{ marginBottom: '12px' }}>
        <SimulatorSection
          localGrades={localGrades}
          addGrade={addGrade}
          removeGrade={removeGrade}
          realAverage={average}
          simulatedAverage={simulatedAverage}
        />
      </div>

      {/* Grades list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[...grades]
          .sort((a, b) => b.evtDate.localeCompare(a.evtDate))
          .map(grade => (
            <GradeCard key={grade.evtId} grade={grade} />
          ))}
      </div>
    </div>
  )
}
