import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

type EventAction = 'PRINT' | 'EXPORT_PDF' | 'EXPORT_HTML' | 'EXPORT_JSON'
type EventSubjectType = 'project' | 'surat' | 'berita' | 'perjanjian' | 'nda'

interface EventPayload {
  action: EventAction
  subject_type: EventSubjectType
  subject_id: number
  note?: string
}

/**
 * Backend hanya mencatat event ke activity_log — sidebar Riwayat akan refresh.
 * File generation tetap dilakukan client-side (D4 keputusan stack).
 */
export function useLogEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: EventPayload) => {
      const { data } = await api.post<{ message: string; activity_id: number }>('/events', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['activity'] })
    },
  })
}

export type { EventAction, EventSubjectType }
