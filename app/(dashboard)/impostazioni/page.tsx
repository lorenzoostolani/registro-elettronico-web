'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/app/components/ui/Card'
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner'
import { useSettings } from '@/lib/hooks/useSettings'
import { Grade } from '@/lib/domain/grades/entities'
import { fetchGradesWithAuthGuard } from '@/lib/utils/auth-client'

function parseObjectiveInput(value: string): number | null {
  const normalized = value.replace(',', '.')
  const parsed = Number(normalized)
  if (Number.isNaN(parsed)) return null
  if (parsed < 0 || parsed > 10) return null
  return Number(parsed.toFixed(1))
}

export default function ImpostazioniPage() {
  const router = useRouter()
  const { settings, actions, ready } = useSettings()
  const [grades, setGrades] = useState<Grade[]>([])
  const [objectiveDraft, setObjectiveDraft] = useState(String(settings.objective))
  const [subjectObjectiveDrafts, setSubjectObjectiveDrafts] = useState<Record<string, string>>({})

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  useEffect(() => {
    fetchGradesWithAuthGuard()
      .then((data) => {
        if (!data) return
        setGrades(data.grades ?? [])
      })
      .catch(() => setGrades([]))
  }, [])

  const subjects = useMemo(() => {
    const map = new Map<number, string>()
    grades.forEach((g) => map.set(g.subjectId, g.subjectDesc))
    return [...map.entries()]
  }, [grades])

  useEffect(() => {
    setObjectiveDraft(String(settings.objective))
  }, [settings.objective])

  useEffect(() => {
    setSubjectObjectiveDrafts((prev) => {
      const next: Record<string, string> = {}
      subjects.forEach(([subjectId]) => {
        const key = String(subjectId)
        const hasSpecificObjective = settings.objectives[key] !== undefined
        if (hasSpecificObjective) {
          next[key] = prev[key] ?? String(settings.objectives[key])
          return
        }
        next[key] = String(settings.objective)
      })
      return next
    })
  }, [settings.objective, settings.objectives, subjects])

  const commitGeneralObjective = () => {
    const parsed = parseObjectiveInput(objectiveDraft)
    if (parsed !== null) {
      actions.setObjective(parsed)
      setObjectiveDraft(String(parsed))
      return
    }

    setObjectiveDraft(String(settings.objective))
  }

  const commitSubjectObjective = (subjectId: string) => {
    const parsed = parseObjectiveInput(subjectObjectiveDrafts[subjectId] ?? '')
    if (parsed !== null) {
      if (parsed === settings.objective) {
        actions.setSubjectObjective(subjectId, null)
      } else {
        actions.setSubjectObjective(subjectId, parsed)
      }
      setSubjectObjectiveDrafts((prev) => ({ ...prev, [subjectId]: String(parsed) }))
      return
    }

    const fallback = settings.objectives[subjectId] ?? settings.objective
    setSubjectObjectiveDrafts((prev) => ({ ...prev, [subjectId]: String(fallback) }))
  }

  if (!ready) return <LoadingSpinner />

  return (
    <div>
      <div className="space-y-4">
        <Card>
          <h3 className="font-semibold">Obiettivo generale</h3>
          <p className="mt-1 text-sm text-text2">Valori da 0 a 10, con un decimale (es. 6.5).</p>
          <input
            aria-label="Obiettivo generale"
            inputMode="decimal"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={objectiveDraft}
            onChange={(e) => {
              setObjectiveDraft(e.target.value)
            }}
            onBlur={commitGeneralObjective}
            className="mt-2 w-28 rounded-lg border border-borderToken bg-surface2 px-3 py-2 text-text"
          />
        </Card>

        <Card>
          <h3 className="mb-2 font-semibold">Obiettivi per singola materia</h3>
          <p className="mb-3 text-sm text-text2">Lascia il valore desiderato per ogni materia (0-10).</p>
          <div className="space-y-3">
            {subjects.map(([subjectId, subjectDesc]) => (
              <div key={subjectId} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <label htmlFor={`objective-${subjectId}`} className="text-sm">{subjectDesc}</label>
                <input
                  id={`objective-${subjectId}`}
                  aria-label={`Obiettivo ${subjectDesc}`}
                  inputMode="decimal"
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={subjectObjectiveDrafts[String(subjectId)] ?? String(settings.objectives[String(subjectId)] ?? settings.objective)}
                  onChange={(e) => setSubjectObjectiveDrafts((prev) => ({ ...prev, [String(subjectId)]: e.target.value }))}
                  onBlur={() => commitSubjectObjective(String(subjectId))}
                  className="w-24 rounded-lg border border-borderToken bg-surface2 px-2 py-1 text-text"
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
          <h3 className="font-semibold">Calcolo media (default)</h3>
          <label className="mt-2 block text-sm">
            <input
              type="radio"
              checked={settings.generalAverageMode === 'all_grades'}
              onChange={() => actions.setGeneralAverageMode('all_grades')}
            />{' '}
            Media di tutti i voti (rispettando il peso % di ogni voto)
          </label>
          <label className="mt-1 block text-sm">
            <input
              type="radio"
              checked={settings.generalAverageMode === 'three_type_mean'}
              onChange={() => actions.setGeneralAverageMode('three_type_mean')}
            />{' '}
            Media delle 3 medie: scritto, orale, pratico
          </label>
          <p className="mt-3 text-sm text-text2">Questo valore è usato come default. Puoi sovrascriverlo per materia qui sotto.</p>
        </Card>

        <Card>
          <h3 className="mb-2 font-semibold">Calcolo media per singola materia</h3>
          <div className="space-y-3">
            {subjects.map(([subjectId, subjectDesc]) => {
              const currentMode = settings.subjectAverageModes[String(subjectId)] ?? settings.generalAverageMode
              return (
                <div key={subjectId} className="grid grid-cols-[1fr_auto] items-center gap-3">
                  <label htmlFor={`avg-mode-${subjectId}`} className="text-sm">{subjectDesc}</label>
                  <select
                    id={`avg-mode-${subjectId}`}
                    aria-label={`Calcolo media ${subjectDesc}`}
                    value={currentMode}
                    onChange={(e) => actions.setSubjectAverageMode(String(subjectId), e.target.value as 'all_grades' | 'three_type_mean')}
                    className="rounded-lg border border-borderToken bg-surface2 px-3 py-1 text-sm text-text"
                  >
                    <option value="all_grades">Media di tutti i voti</option>
                    <option value="three_type_mean">Media delle medie (S/O/P)</option>
                  </select>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Anno scolastico / classe</h3>
          <select value={settings.studentYear} onChange={(e) => actions.setStudentYear(Number(e.target.value))} className="mt-2 rounded-lg border border-borderToken bg-surface2 px-3 py-2 text-text">
            {[1, 2, 3, 4, 5].map((y) => (
              <option key={y} value={y}>{y}ª superiore</option>
            ))}
          </select>
        </Card>

        <Card>
          <h3 className="font-semibold">Account</h3>
          <p className="mt-1 text-sm text-text2">Se vuoi cambiare utente, esegui il logout.</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-borderToken bg-surface2 px-3 py-2 text-sm font-semibold text-text"
          >
            Logout
          </button>
        </Card>
      </div>
    </div>
  )
}
