'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { SubjectRow } from '@/app/components/features/SubjectRow'
import { Grade, computeAverage, computeGradeNeeded, getAverageColorVsObjective } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'

export default function VotiPage() {
  const { settings, ready } = useSettings()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      const response = await fetch('/api/grades')
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Errore caricamento voti')
      } else {
        setGrades(data.grades)
      }
      setLoading(false)
    }

    run()
  }, [])

  const periods = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of grades) map.set(g.periodPos, g.periodDesc)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [grades])

  useEffect(() => {
    if (period === null && periods.length > 0) setPeriod(periods[0][0])
  }, [period, periods])

  const subjects = useMemo(() => {
    const filtered = period === null ? [] : grades.filter((grade) => grade.periodPos === period)
    const group = new Map<number, Grade[]>()
    filtered.forEach((grade) => {
      const existing = group.get(grade.subjectId) ?? []
      existing.push(grade)
      group.set(grade.subjectId, existing)
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
          gradeNeeded: computeGradeNeeded(objective, avg ?? Number.NaN, subGrades.length)
        }
      })
      .sort((a, b) => {
        const av = a.average ?? -1
        const bv = b.average ?? -1
        return settings.sortAscending ? av - bv : bv - av
      })
  }, [grades, period, settings])

  if (loading || !ready) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />

  return (
    <div>
      <PageHeader title="Voti" subtitle="Panoramica medie per materia" />
      <div className="mb-4 flex gap-2">
        {periods.map(([id, desc]) => (
          <button key={id} onClick={() => setPeriod(id)} className={`rounded-lg border px-3 py-2 text-sm ${id === period ? 'border-blueToken bg-[var(--blue-bg)] text-blueToken' : 'border-borderToken'}`}>
            {desc}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {subjects.length === 0 ? (
          <EmptyState title="Nessun voto" description="Non ci sono voti disponibili per il periodo selezionato." />
        ) : (
          subjects.map((subject) => (
            <SubjectRow
              key={subject.subjectId}
              subjectId={subject.subjectId}
              subjectDesc={subject.subjectDesc}
              average={subject.average}
              averageVariant={getAverageColorVsObjective(subject.average, subject.objective)}
              needed={subject.gradeNeeded}
            />
          ))
        )}
      </div>
    </div>
  )
}
