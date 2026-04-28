'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { AverageCircle } from '@/app/components/features/AverageCircle'
import { GradeCard } from '@/app/components/features/GradeCard'
import { SimulatorSection } from '@/app/components/features/SimulatorSection'
import { Grade, GradeType, computeAverage, computeWeightedAverage, getGradeType } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'
import { useLocalGrades } from '@/lib/hooks/useLocalGrades'

const WEIGHTS_KEY = 'rv_grade_weights'

function formatPeriodLabel(desc: string, pos: number): string {
  if (desc.toLowerCase() === 'quadrimestre') {
    if (pos === 1) return '1° Quadrimestre'
    if (pos === 2) return '2° Quadrimestre'
  }
  return desc
}

export default function SubjectDetailPage() {
  const params = useParams<{ subjectId: string }>()
  const router = useRouter()
  const subjectId = Number(params.subjectId)
  const { settings, ready } = useSettings()
  const [allGrades, setAllGrades] = useState<Grade[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<number | null>(null)
  const [weightOverrides, setWeightOverrides] = useState<Record<string, number>>({})

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

  const subjectGrades = useMemo(() => allGrades.filter(g => g.subjectId === subjectId), [allGrades, subjectId])

  const periods = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of subjectGrades) map.set(g.periodPos, g.periodDesc)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [subjectGrades])

  useEffect(() => {
    if (period === null && periods.length > 0) setPeriod(periods[0][0])
  }, [period, periods])

  const grades = useMemo(() => subjectGrades.filter(g => g.periodPos === period), [subjectGrades, period])

  const weightsStorageKey = `${subjectId}_${period ?? 0}`
  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(WEIGHTS_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as Record<string, Record<string, number>>
      setWeightOverrides(parsed[weightsStorageKey] ?? {})
    } catch {
      setWeightOverrides({})
    }
  }, [weightsStorageKey])

  const updateWeight = (gradeKey: string, nextPercent: number) => {
    const next = { ...weightOverrides, [gradeKey]: nextPercent }
    setWeightOverrides(next)
    if (typeof window !== 'undefined') {
      const raw = window.localStorage.getItem(WEIGHTS_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, Record<string, number>>) : {}
      parsed[weightsStorageKey] = next
      window.localStorage.setItem(WEIGHTS_KEY, JSON.stringify(parsed))
    }
  }

  const effectiveGrades = useMemo(
    () => grades.map((g) => ({ ...g, weightFactor: (weightOverrides[String(g.evtId)] ?? g.weightFactor * 100) / 100 })),
    [grades, weightOverrides]
  )

  const { grades: localGrades, addGrade, updateGrade, removeGrade } = useLocalGrades(String(subjectId), period ?? 0)
  const subjectAverageMode = settings.subjectAverageModes[String(subjectId)] ?? settings.generalAverageMode

  const synthetic = useMemo(
    () =>
      localGrades.map((g, idx) => ({
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
        componentDesc: g.type,
        weightFactor: g.weightPercent / 100,
        notesForFamily: '',
      })) as Grade[],
    [grades, localGrades, period, subjectId]
  )

  const average = computeAverage(effectiveGrades, subjectAverageMode)
  const objective = settings.objectives[String(subjectId)] ?? settings.objective

  const recalculatedAverage = useMemo(
    () => computeAverage([...effectiveGrades, ...synthetic], subjectAverageMode),
    [effectiveGrades, synthetic, subjectAverageMode]
  )

  const typeAverage = (type: GradeType) => computeWeightedAverage(effectiveGrades.filter(g => getGradeType(g.componentDesc) === type))

  const progressPercent = Math.min(100, ((average ?? 0) / objective) * 100)
  const progressColor = (average ?? 0) >= objective ? 'var(--green)' : (average ?? 0) >= objective - 1 ? 'var(--amber)' : 'var(--red)'

  if (loading || !ready) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />

  const subjectName = subjectGrades[0]?.subjectDesc ?? 'Materia'

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '4px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{subjectName}</h1>
      </div>

      {periods.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {periods.map(([id, desc]) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              style={{
                padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: period === id ? 'var(--red)' : 'var(--surface)', color: period === id ? '#fff' : 'var(--text-2)',
              }}
            >
              {formatPeriodLabel(desc, id)}
            </button>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-around' }}>
        <AverageCircle label="Scritto" value={typeAverage('Scritto')} size={80} />
        <AverageCircle label="Orale" value={typeAverage('Orale')} size={80} />
        <AverageCircle label="Pratico" value={typeAverage('Pratico')} size={80} />
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px', border: '1px solid var(--border)' }}>
        <div style={{ height: '10px', background: 'var(--surface-3)', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', width: `${progressPercent}%`, background: progressColor, borderRadius: '5px', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-2)' }}>
          <span>Obiettivo: {objective}</span>
          <span>Media attuale: {average?.toFixed(2) ?? '—'}</span>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <SimulatorSection
          localGrades={localGrades}
          addGrade={addGrade}
          updateGrade={updateGrade}
          removeGrade={removeGrade}
          recalculatedAverage={recalculatedAverage}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[...effectiveGrades].sort((a, b) => b.evtDate.localeCompare(a.evtDate)).map((grade) => (
          <GradeCard
            key={grade.evtId}
            grade={grade}
            weightPercent={Math.round(grade.weightFactor * 100)}
            onWeightPercentChange={(next) => updateWeight(String(grade.evtId), next)}
          />
        ))}
      </div>
    </div>
  )
}
