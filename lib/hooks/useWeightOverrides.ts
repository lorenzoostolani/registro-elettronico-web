'use client'

import { useEffect, useRef, useState } from 'react'

// weightOverrides shape stored in Redis:
// Record<storageKey, Record<gradeEvtId, weightPercent>>
// e.g. { "123_1": { "456": 50, "789": 150 } }
export type AllWeightOverrides = Record<string, Record<string, number>>

export function useWeightOverrides(storageKey: string) {
  const [all, setAll] = useState<AllWeightOverrides>({})
  const [loaded, setLoaded] = useState(false)
  // Avoid saving before the initial load is done (would overwrite with empty)
  const loadedRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch('/api/storage/get', { cache: 'no-store' })
        if (!res.ok) throw new Error('Storage unavailable')
        const payload = (await res.json()) as { weightOverrides?: AllWeightOverrides | null }
        if (mounted) {
          setAll(payload.weightOverrides ?? {})
          loadedRef.current = true
          setLoaded(true)
        }
      } catch {
        if (mounted) {
          loadedRef.current = true
          setLoaded(true)
        }
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const updateWeight = (gradeEvtId: string, weightPercent: number) => {
    setAll((prev) => {
      const next: AllWeightOverrides = {
        ...prev,
        [storageKey]: { ...prev[storageKey], [gradeEvtId]: weightPercent },
      }
      if (loadedRef.current) {
        void fetch('/api/storage/set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weightOverrides: next }),
        })
      }
      return next
    })
  }

  const overrides = all[storageKey] ?? {}

  return { overrides, updateWeight, loaded }
}
