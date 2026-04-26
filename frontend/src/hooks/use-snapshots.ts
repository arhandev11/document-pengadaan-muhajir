import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Paginated } from '@/types/project'
import type { Snapshot, SnapshotableType } from '@/types/snapshot'

const listKey = (type: SnapshotableType, id: number) => ['snapshots', type, id] as const

/**
 * List snapshots untuk entity tertentu. Doc type must match backend route
 * segment: 'projects' (plural) untuk project, singular untuk lainnya.
 */
export function useSnapshots(type: SnapshotableType, id: number | undefined) {
  return useQuery({
    queryKey: listKey(type, id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Snapshot>>(`/${type}/${id}/snapshots`)
      return data
    },
    enabled: id !== undefined,
  })
}

export function useCreateSnapshot(type: SnapshotableType, id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (label?: string) => {
      const { data } = await api.post<{ data: Snapshot }>(`/${type}/${id}/snapshots`, {
        label: label || undefined,
      })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey(type, id) }),
  })
}

export function useRestoreSnapshot() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (snapshotId: number) => {
      const { data } = await api.post<{
        message: string
        snapshotable_type: string
        snapshotable_id: number
      }>(`/snapshots/${snapshotId}/restore`)
      return data
    },
    onSuccess: (data) => {
      // Invalidate subject dari snapshot agar UI reflect restored state
      const key = data.snapshotable_type === 'project' ? 'projects' : data.snapshotable_type
      qc.invalidateQueries({ queryKey: [key === 'projects' ? 'projects' : data.snapshotable_type] })
      qc.invalidateQueries({ queryKey: [data.snapshotable_type, data.snapshotable_id] })
      qc.invalidateQueries({ queryKey: ['snapshots'] })
    },
  })
}

export function useDeleteSnapshot(type: SnapshotableType, id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (snapshotId: number) => {
      await api.delete(`/snapshots/${snapshotId}`)
      return snapshotId
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey(type, id) }),
  })
}
