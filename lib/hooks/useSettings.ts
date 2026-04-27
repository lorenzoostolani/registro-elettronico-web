'use client'

import { useEffect, useMemo, useState } from 'react'

export interface AppSettings {
  objective: number
  objectives: Record<string, number>
  sortAscending: boolean
  useWeightedAverage: boolean
  studentYear: number
}

const DEFAULT_SETTINGS: AppSettings = {
  objective: 6,
  objectives: {},
  sortAscending: false,
  useWeightedAverage: true,
  studentYear: 3
}

const KEY = 'rv_settings'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<AppSettings>
        setSettings({ ...DEFAULT_SETTINGS, ...parsed, objectives: parsed.objectives ?? {} })
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
      setObjective: (objective: number) => updateSettings({ objective }),
      setSubjectObjective: (subjectId: string, objective: number) =>
        updateSettings({ objectives: { ...settings.objectives, [subjectId]: objective } }),
      setSortAscending: (sortAscending: boolean) => updateSettings({ sortAscending }),
      setUseWeightedAverage: (useWeightedAverage: boolean) => updateSettings({ useWeightedAverage }),
      setStudentYear: (studentYear: number) => updateSettings({ studentYear })
    }),
    [settings.objectives]
  )

  return { settings, actions, ready }
}
