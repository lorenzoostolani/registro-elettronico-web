'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { Line, LineChart, CartesianGrid, ReferenceLine, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { ErrorState } from '@/app/components/ui/ErrorState'
import { Card } from '@/app/components/ui/Card'
import { GradeCard } from '@/app/components/features/GradeCard'
import { AverageCircle } from '@/app/components/features/AverageCircle'
import { SimulatorSection } from '@/app/components/features/SimulatorSection'
import { Grade, computeAverage, isValidGrade } from '@/lib/domain/grades/entities'
import { useSettings } from '@/lib/hooks/useSettings'
import { useLocalGrades } from '@/lib/hooks/useLocalGrades'

export default function SubjectDetailPage() {
  const params = useParams<{ subjectId: string }>()
  const subjectId = Number(params.subjectId)
  const { settings, ready } = useSettings()
  const [allGrades, setAllGrades] = useState<Grade[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/grades')
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Errore caricamento voti')
      else setAllGrades(data.grades)
      setLoading(false)
    }
    run()
  }, [])

  const subjectGradesAllPeriods = useMemo(
    () => allGrades.filter((grade) => grade.subjectId === subjectId),
    [allGrades, subjectId]
  )

  const periods = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of subjectGradesAllPeriods) map.set(g.periodPos, g.periodDesc)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [subjectGradesAllPeriods])

  useEffect(() => {
    if (period === null && periods.length > 0) setPeriod(periods[0][0])
  }, [period, periods])

  const grades = useMemo(() => subjectGradesAllPeriods.filter((grade) => grade.periodPos === period), [period, subjectGradesAllPeriods])
  const { grades: localGrades, addGrade, removeGrade } = useLocalGrades(String(subjectId), period ?? 0)

  const average = computeAverage(grades, settings.useWeightedAverage)

  const simulatedAverage = useMemo(() => {
    const synthetic = localGrades.map((g, idx) => ({
      subjectId,
      subjectDesc: grades[0]?.subjectDesc ?? '',
      evtId: -1000 - idx,
      evtCode: 'LOCAL',
      evtDate: new Date().toISOString().slice(0, 10),
      decimalValue: g.value,
      displayValue: g.value.toFixed(2),
      cancelled: false,
      underlined: false,
      periodPos: period ?? 0,
      periodDesc: grades[0]?.periodDesc ?? '',
      componentPos: 0,
      componentDesc: 'Simulazione',
      weightFactor: 1
    })) as Grade[]

    return computeAverage([...grades, ...synthetic], settings.useWeightedAverage)
  }, [grades, localGrades, period, settings.useWeightedAverage, subjectId])

  const typeAverage = (type: string) => computeAverage(grades.filter((g) => g.componentDesc === type), settings.useWeightedAverage)

  const chartData = useMemo(() => {
    const valid = [...grades].filter(isValidGrade).sort((a, b) => a.evtDate.localeCompare(b.evtDate))
    let progressiveTotal = 0
    return valid.map((g, i) => {
      progressiveTotal += g.decimalValue ?? 0
      return {
        date: g.evtDate,
        voto: g.decimalValue,
        media: progressiveTotal / (i + 1)
      }
    })
  }, [grades])

  if (loading || !ready) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />
  if (grades.length === 0) return <ErrorState message="Materia o periodo non trovato" />

  const objective = settings.objectives[String(subjectId)] ?? settings.objective

  return (
    <div>
      <PageHeader title={grades[0].subjectDesc} subtitle="Dettaglio materia" />
      <div className="mb-4 flex gap-2">
        {periods.map(([id, desc]) => (
          <button key={id} onClick={() => setPeriod(id)} className={`rounded-lg border px-3 py-2 text-sm ${id === period ? 'border-blueToken bg-[var(--blue-bg)] text-blueToken' : 'border-borderToken'}`}>
            {desc}
          </button>
        ))}
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <AverageCircle label="Media generale" value={average} />
        <AverageCircle label="Scritto" value={typeAverage('Scritto')} />
        <AverageCircle label="Orale" value={typeAverage('Orale')} />
        <AverageCircle label="Pratico" value={typeAverage('Pratico')} />
      </div>

      <Card className="mb-4">
        <h3 className="mb-3 font-semibold">Andamento voti</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <ReferenceLine y={objective} stroke="var(--amber)" strokeDasharray="6 4" />
              <Line type="monotone" dataKey="voto" stroke="var(--blue)" strokeWidth={2} />
              <Line type="monotone" dataKey="media" stroke="var(--green)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="mb-4">
        <p className="text-sm">Il tuo obiettivo: {objective}</p>
        <p className="mb-2 text-sm">La tua media: {average?.toFixed(2) ?? '—'}</p>
        <div className="h-3 w-full rounded-full bg-surface-2">
          <div className="h-3 rounded-full bg-blueToken" style={{ width: `${Math.min(100, ((average ?? 0) / objective) * 100)}%` }} />
        </div>
      </Card>

      <div className="mb-4">
        <SimulatorSection
          localGrades={localGrades}
          addGrade={addGrade}
          removeGrade={removeGrade}
          realAverage={average}
          simulatedAverage={simulatedAverage}
        />
      </div>

      <div className="space-y-3">
        {[...grades]
          .sort((a, b) => b.evtDate.localeCompare(a.evtDate))
          .map((grade) => (
            <GradeCard key={grade.evtId} grade={grade} />
          ))}
      </div>
    </div>
  )
}
