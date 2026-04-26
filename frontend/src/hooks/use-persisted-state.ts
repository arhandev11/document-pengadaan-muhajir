import { useEffect, useState } from 'react'

/**
 * useState yang otomatis sync ke localStorage. Closes PRD §15.7
 * (UI state seperti filter, currentTab tidak ter-persist).
 *
 * Pakai untuk preferences yang user mau remember antar session:
 * filter, sort, last-selected project, dll.
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) return JSON.parse(stored) as T
    } catch {
      // Silent fail — fallback to default kalau JSON corrupt
    }
    return defaultValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded? Silent — preference loss bukan kritis.
    }
  }, [key, value])

  return [value, setValue]
}
