'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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

function clampObjective(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(10, Math.max(0, Number(value.toFixed(1))))
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const response = await fetch('/api/storage/get', { cache: 'no-store' })
        if (!response.ok) throw new Error('Storage unavailable')
        const payload = (await response.json()) as { settings?: Partial<AppSettings> | null }
        const parsed = payload.settings

        if (!mounted) return
        if (parsed) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
            objective: clampObjective(parsed.objective ?? DEFAULT_SETTINGS.objective),
            objectives: parsed.objectives ?? {},
            subjectAverageModes: parsed.subjectAverageModes ?? {},
          })
        } else {
          setSettings(DEFAULT_SETTINGS)
        }
      } catch {
        if (mounted) setSettings(DEFAULT_SETTINGS)
      } finally {
        if (mounted) setReady(true)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const persistSettings = async (next: AppSettings) => {
    await fetch('/api/storage/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: next }),
    })
  }

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      void persistSettings(next)
      return next
    })
  }, [])

  const actions = useMemo(
    () => ({
      setObjective: (objective: number) => updateSettings({ objective: clampObjective(objective) }),
      setSubjectObjective: (subjectId: string, objective: number | null) => {
        const nextObjectives = { ...settings.objectives }
        if (objective === null) {
          delete nextObjectives[subjectId]
        } else {
          nextObjectives[subjectId] = clampObjective(objective)
        }
        updateSettings({ objectives: nextObjectives })
      },
      setSortAscending: (sortAscending: boolean) => updateSettings({ sortAscending }),
      setGeneralAverageMode: (generalAverageMode: GeneralAverageMode) => updateSettings({ generalAverageMode }),
      setSubjectAverageMode: (subjectId: string, mode: GeneralAverageMode) =>
        updateSettings({ subjectAverageModes: { ...settings.subjectAverageModes, [subjectId]: mode } }),
      setStudentYear: (studentYear: number) => updateSettings({ studentYear }),
    }),
    [settings.objectives, settings.subjectAverageModes, updateSettings]
  )

  return { settings, actions, ready }
}
