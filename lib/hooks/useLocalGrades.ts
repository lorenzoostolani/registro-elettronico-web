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

const KEY = 'rv_local_grades'

export function useLocalGrades(subjectId: string, periodPos: number) {
  const storageKey = `${subjectId}_${periodPos}`
  const [grades, setGrades] = useState<LocalGrade[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as LocalGrades
      setGrades(parsed[storageKey] ?? [])
    } catch {
      setGrades([])
    }
  }, [storageKey])

  const persist = (next: LocalGrade[]) => {
    setGrades(next)
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as LocalGrades) : {}
    parsed[storageKey] = next
    window.localStorage.setItem(KEY, JSON.stringify(parsed))
  }

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
