'use client'

import { useEffect, useState } from 'react'
import { GradeType } from '@/lib/domain/grades/entities'

export interface LocalGrade {
  value: number
  id: string
  type: GradeType
  weightPercent: number
}

export type LocalGrades = Record<string, LocalGrade[]>

export function useLocalGrades(subjectId: string, periodPos: number) {
  const storageKey = `${subjectId}_${periodPos}`
  const [allGrades, setAllGrades] = useState<LocalGrades>({})

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const response = await fetch('/api/storage/get', { cache: 'no-store' })
        if (!response.ok) throw new Error('Storage unavailable')
        const payload = (await response.json()) as { localGrades?: LocalGrades | null }
        if (mounted) {
          setAllGrades(payload.localGrades ?? {})
        }
      } catch {
        if (mounted) setAllGrades({})
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const persist = (next: LocalGrade[]) => {
    setAllGrades((prev) => {
      const updated = { ...prev, [storageKey]: next }
      void fetch('/api/storage/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ localGrades: updated }),
      })
      return updated
    })
  }

  const grades = allGrades[storageKey] ?? []

  const addGrade = (value: number, type: GradeType, weightPercent: number) => {
    persist([...grades, { value, type, weightPercent, id: crypto.randomUUID() }])
  }

  const updateGrade = (id: string, patch: Partial<Pick<LocalGrade, 'type' | 'weightPercent'>>) => {
    persist(grades.map((grade) => (grade.id === id ? { ...grade, ...patch } : grade)))
  }

  const removeGrade = (id: string) => {
    persist(grades.filter((grade) => grade.id !== id))
  }

  return { grades, addGrade, updateGrade, removeGrade }
}
