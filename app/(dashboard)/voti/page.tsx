'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { SubjectRow } from '@/app/components/features/SubjectRow'
import { AverageCircle } from '@/app/components/features/AverageCircle'
import { Grade, computeAverage, computeGradeNeeded, getAverageColorVsObjective, isValidGrade } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'
import { fetchGradesWithAuthGuard } from '@/lib/utils/auth-client'
import { useState } from 'react'

function formatPeriodLabel(desc: string, index: number): string {
  if (desc.toLowerCase() === 'quadrimestre') {
    if (index === 0) return '1° Quadrimestre'
    if (index === 1) return '2° Quadrimestre'
  }
  return desc
}

export default function VotiPage() {
  const { settings, ready } = useSettings()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Period is stored in the URL: ?period=latest | ?period=general | ?period=<number>
  // This way router.back() from a subject page always restores the correct tab.
  const rawPeriod = searchParams.get('period') ?? 'latest'
  const period: number | 'latest' | 'general' =
    rawPeriod === 'latest' || rawPeriod === 'general'
      ? rawPeriod
      : Number(rawPeriod)

  const setPeriod = (next: number | 'latest' | 'general') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', String(next))
    router.replace(`/voti?${params.toString()}`)
  }

  useEffect(() => {
    fetchGradesWithAuthGuard()
      .then(data => {
        if (!data) return
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

  const tabs = useMemo(() => [
    { id: 'latest' as const, label: 'Ultimi voti' },
    ...periods.map(([id, desc], periodIndex) => ({ id: id as number, label: formatPeriodLabel(desc, periodIndex) })),
    { id: 'general' as const, label: 'Generale' },
  ], [periods])

  const filteredGrades = useMemo(() => {
    if (period === 'latest') return grades
    if (period === 'general') return grades
    return grades.filter(g => g.periodPos === period)
  }, [grades, period])

  const overallAverage = useMemo(() =>
    computeAverage(filteredGrades, settings.generalAverageMode),
    [filteredGrades, settings.generalAverageMode]
  )

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
        const avgMode = settings.subjectAverageModes[String(subjectId)] ?? settings.generalAverageMode
        const avg = computeAverage(subGrades, avgMode)
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
  }, [grades, filteredGrades, period, periods, settings.generalAverageMode, settings.objective, settings.objectives, settings.sortAscending, settings.subjectAverageModes])

  const selectedSubjectPeriod = useMemo(() => {
    if (period === 'latest') return periods[0]?.[0] ?? null
    if (period === 'general') return null
    return period
  }, [period, periods])

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
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AverageCircle label="Media" value={overallAverage} size={90} />
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
              period={selectedSubjectPeriod}
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
