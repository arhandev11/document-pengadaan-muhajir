import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Activity, ActivityFilters, ActivityStats } from '@/types/activity'
import type { Paginated } from '@/types/project'

const LIST_KEY = ['activity'] as const
const STATS_KEY = ['activity', 'stats'] as const

export function useActivity(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, 'list', filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
      )
      const { data } = await api.get<Paginated<Activity>>('/activity', { params })
      return data
    },
  })
}

export function useActivityStats() {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: async () => {
      const { data } = await api.get<ActivityStats>('/activity/stats')
      return data
    },
    // Auto-refresh every 30s — stats kecil, efisien untuk live feel
    refetchInterval: 30_000,
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/activity/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useClearActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ message: string; deleted: number }>('/activity')
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}
