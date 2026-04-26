import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  Pasal,
  Perjanjian,
  PerjanjianCreateInput,
  PerjanjianTipe,
  PerjanjianUpdateInput,
  Poin,
  SubPoin,
} from '@/types/perjanjian'
import type { Paginated } from '@/types/project'

const LIST_KEY = ['perjanjian'] as const
const detailKey = (id: number | string) => ['perjanjian', Number(id)] as const

export function usePerjanjianByProject(projectId: number | string | undefined) {
  return useQuery({
    queryKey: [...LIST_KEY, 'byProject', projectId ? Number(projectId) : null],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Perjanjian>>(
        `/projects/${projectId}/perjanjian`,
      )
      return data
    },
    enabled: projectId !== undefined,
  })
}

export function usePerjanjian(id: number | string | undefined) {
  return useQuery({
    queryKey: detailKey(id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<{ data: Perjanjian }>(`/perjanjian/${id}`)
      return data.data
    },
    enabled: id !== undefined && id !== 'new',
  })
}

export function useCreatePerjanjian(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PerjanjianCreateInput) => {
      const { data } = await api.post<{ data: Perjanjian }>(
        `/projects/${projectId}/perjanjian`,
        payload,
      )
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}

export function useUpdatePerjanjian(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PerjanjianUpdateInput) => {
      const { data } = await api.patch<{ data: Perjanjian }>(`/perjanjian/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useDeletePerjanjian() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/perjanjian/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}

export function useResetPerjanjianTemplate(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (tipe: PerjanjianTipe) => {
      const { data } = await api.post<{ data: Perjanjian }>(
        `/perjanjian/${id}/reset-template`,
        { tipe },
      )
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

// ── Pasal ────────────────────────────────────────────────────────────

export function useAddPasal(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { judul?: string; intro?: string }) => {
      const { data } = await api.post<{ data: Pasal }>(
        `/perjanjian/${perjanjianId}/pasal`,
        payload,
      )
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useUpdatePasal(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ pasalId, payload }: { pasalId: number; payload: { judul?: string; intro?: string } }) => {
      const { data } = await api.patch<{ data: Pasal }>(`/pasal/${pasalId}`, payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useDeletePasal(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (pasalId: number) => {
      await api.delete(`/pasal/${pasalId}`)
      return pasalId
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useReorderPasal(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post(`/perjanjian/${perjanjianId}/pasal/reorder`, { ids })
      return ids
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

// ── Poin ─────────────────────────────────────────────────────────────

export function useAddPoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ pasalId, text }: { pasalId: number; text?: string }) => {
      const { data } = await api.post<{ data: Poin }>(`/pasal/${pasalId}/poin`, { text: text ?? '' })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useUpdatePoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ poinId, text }: { poinId: number; text: string }) => {
      const { data } = await api.patch<{ data: Poin }>(`/poin/${poinId}`, { text })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useDeletePoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (poinId: number) => {
      await api.delete(`/poin/${poinId}`)
      return poinId
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useReorderPoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ pasalId, ids }: { pasalId: number; ids: number[] }) => {
      await api.post(`/pasal/${pasalId}/poin/reorder`, { ids })
      return ids
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

// ── Sub-poin ─────────────────────────────────────────────────────────

export function useAddSubPoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ poinId, text }: { poinId: number; text?: string }) => {
      const { data } = await api.post<{ data: SubPoin }>(`/poin/${poinId}/sub-poin`, { text: text ?? '' })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useUpdateSubPoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ subId, text }: { subId: number; text: string }) => {
      const { data } = await api.patch<{ data: SubPoin }>(`/sub-poin/${subId}`, { text })
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}

export function useDeleteSubPoin(perjanjianId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (subId: number) => {
      await api.delete(`/sub-poin/${subId}`)
      return subId
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(perjanjianId) }),
  })
}
