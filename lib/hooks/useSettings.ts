'use client'

import { useEffect, useMemo, useState } from 'react'
import { GeneralAverageMode } from '@/lib/domain/grades/entities'

export interface AppSettings {
  objective: number
  objectives: Record<string, number>
  sortAscending: boolean
  generalAverageMode: GeneralAverageMode
  subjectAverageModes: Record<string, GeneralAverageMode>
  studentYear: number
}

const DEFAULT_SETTINGS: AppSettings = {
  objective: 6,
  objectives: {},
  sortAscending: false,
  generalAverageMode: 'all_grades',
  subjectAverageModes: {},
  studentYear: 3,
}

const KEY = 'rv_settings'

function clampObjective(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(10, Math.max(0, Number(value.toFixed(1))))
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<AppSettings>
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
          objective: clampObjective(parsed.objective ?? DEFAULT_SETTINGS.objective),
          objectives: parsed.objectives ?? {},
          subjectAverageModes: parsed.subjectAverageModes ?? {},
        })
      } catch {
        setSettings(DEFAULT_SETTINGS)
      }
    }
    setReady(true)
  }, [])

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(KEY, JSON.stringify(next))
      }
      return next
    })
  }

  const actions = useMemo(
    () => ({
      setObjective: (objective: number) => updateSettings({ objective: clampObjective(objective) }),
      setSubjectObjective: (subjectId: string, objective: number) =>
        updateSettings({ objectives: { ...settings.objectives, [subjectId]: clampObjective(objective) } }),
      setSortAscending: (sortAscending: boolean) => updateSettings({ sortAscending }),
      setGeneralAverageMode: (generalAverageMode: GeneralAverageMode) => updateSettings({ generalAverageMode }),
      setSubjectAverageMode: (subjectId: string, mode: GeneralAverageMode) =>
        updateSettings({ subjectAverageModes: { ...settings.subjectAverageModes, [subjectId]: mode } }),
      setStudentYear: (studentYear: number) => updateSettings({ studentYear }),
    }),
    [settings.objectives, settings.subjectAverageModes]
  )

  return { settings, actions, ready }
}
