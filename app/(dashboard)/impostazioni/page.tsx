'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/app/components/ui/PageHeader'
import { Card } from '@/app/components/ui/Card'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { useSettings } from '@/lib/hooks/useSettings'
import { Grade } from '@/lib/domain/grades/entities'

export default function ImpostazioniPage() {
  const { settings, actions, ready } = useSettings()
  const [grades, setGrades] = useState<Grade[]>([])

  useEffect(() => {
    fetch('/api/grades')
      .then((res) => res.json())
      .then((data) => setGrades(data.grades ?? []))
      .catch(() => setGrades([]))
  }, [])

  const subjects = useMemo(() => {
    const map = new Map<number, string>()
    grades.forEach((g) => map.set(g.subjectId, g.subjectDesc))
    return [...map.entries()]
  }, [grades])

  if (!ready) return <LoadingSpinner />

  return (
    <div>
      <PageHeader title="Impostazioni" subtitle="Personalizza obiettivi e visualizzazione" />

      <div className="space-y-4">
        <Card>
          <h3 className="font-semibold">Obiettivo generale</h3>
          <input type="number" min={3} max={10} step={1} value={settings.objective} onChange={(e) => actions.setObjective(Number(e.target.value))} className="mt-2 w-24 rounded-lg border border-borderToken px-3 py-2" />
        </Card>

        <Card>
          <h3 className="mb-2 font-semibold">Obiettivo per materia</h3>
          <div className="space-y-2">
            {subjects.map(([subjectId, subjectDesc]) => (
              <div key={subjectId} className="flex items-center justify-between gap-2">
                <span className="text-sm">{subjectDesc}</span>
                <input
                  type="number"
                  min={3}
                  max={10}
                  step={1}
                  value={settings.objectives[String(subjectId)] ?? settings.objective}
                  onChange={(e) => actions.setSubjectObjective(String(subjectId), Number(e.target.value))}
                  className="w-20 rounded-lg border border-borderToken px-2 py-1"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Ordinamento materie</h3>
          <div className="mt-2 flex gap-2">
            <button onClick={() => actions.setSortAscending(true)} className={`rounded-lg border px-3 py-2 ${settings.sortAscending ? 'border-blueToken text-blueToken' : 'border-borderToken'}`}>
              Crescente
            </button>
            <button onClick={() => actions.setSortAscending(false)} className={`rounded-lg border px-3 py-2 ${!settings.sortAscending ? 'border-blueToken text-blueToken' : 'border-borderToken'}`}>
              Decrescente
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Tipo di media</h3>
          <label className="mt-2 block text-sm">
            <input type="radio" checked={!settings.useWeightedAverage} onChange={() => actions.setUseWeightedAverage(false)} /> Media aritmetica
          </label>
          <label className="block text-sm">
            <input type="radio" checked={settings.useWeightedAverage} onChange={() => actions.setUseWeightedAverage(true)} /> Media ponderata
          </label>
        </Card>

        <Card>
          <h3 className="font-semibold">Anno scolastico / classe</h3>
          <select
            value={settings.studentYear}
            onChange={(e) => actions.setStudentYear(Number(e.target.value))}
            className="mt-2 rounded-lg border border-borderToken px-3 py-2"
          >
            {[1, 2, 3, 4, 5].map((y) => (
              <option key={y} value={y}>
                {y}ª superiore
              </option>
            ))}
          </select>
        </Card>
      </div>
    </div>
  )
}
