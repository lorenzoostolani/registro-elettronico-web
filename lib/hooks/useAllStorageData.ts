'use client'

import { useEffect, useState } from 'react'
import { LocalGrades } from './useLocalGrades'
import { AllWeightOverrides } from './useWeightOverrides'

export interface AllStorageData {
  localGrades: LocalGrades
  weightOverrides: AllWeightOverrides
  loaded: boolean
}

/**
 * Loads both localGrades and weightOverrides from the storage API in a single
 * fetch call. Useful on pages that need to reflect simulated grades and weight
 * overrides without mounting one hook per subject.
 */
export function useAllStorageData(): AllStorageData {
  const [localGrades, setLocalGrades] = useState<LocalGrades>({})
  const [weightOverrides, setWeightOverrides] = useState<AllWeightOverrides>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await fetch('/api/storage/get', { cache: 'no-store' })
        if (!res.ok) throw new Error('Storage unavailable')
        const payload = (await res.json()) as {
          localGrades?: LocalGrades | null
          weightOverrides?: AllWeightOverrides | null
        }
        if (mounted) {
          setLocalGrades(payload.localGrades ?? {})
          setWeightOverrides(payload.weightOverrides ?? {})
          setLoaded(true)
        }
      } catch {
        if (mounted) setLoaded(true)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return { localGrades, weightOverrides, loaded }
}
