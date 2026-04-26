import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Paginated } from '@/types/project'
import type { Surat, SuratCreateInput, SuratHeaderInput, SuratItem, SuratItemInput } from '@/types/surat'

const LIST_KEY = ['surat'] as const
const detailKey = (id: number | string) => ['surat', Number(id)] as const

/** List surat scoped ke project */
export function useSuratByProject(projectId: number | string | undefined) {
  return useQuery({
    queryKey: [...LIST_KEY, 'byProject', projectId ? Number(projectId) : null],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Surat>>(
        `/projects/${projectId}/surat`,
      )
      return data
    },
    enabled: projectId !== undefined,
  })
}

export function useSurat(id: number | string | undefined) {
  return useQuery({
    queryKey: detailKey(id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<{ data: Surat }>(`/surat/${id}`)
      return data.data
    },
    enabled: id !== undefined && id !== 'new',
  })
}

export function useCreateSurat(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SuratCreateInput) => {
      const { data } = await api.post<{ data: Surat }>(
        `/projects/${projectId}/surat`,
        payload,
      )
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useUpdateSurat(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SuratHeaderInput) => {
      const { data } = await api.patch<{ data: Surat }>(`/surat/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useDeleteSurat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/surat/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

// ── Items ────────────────────────────────────────────────────────────

export function useAddSuratItem(suratId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SuratItemInput) => {
      const { data } = await api.post<{ data: SuratItem }>(
        `/surat/${suratId}/items`,
        payload,
      )
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: detailKey(suratId) })
    },
  })
}

export function useUpdateSuratItem(suratId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, payload }: { itemId: number; payload: SuratItemInput }) => {
      const { data } = await api.patch<{ data: SuratItem }>(
        `/surat-items/${itemId}`,
        payload,
      )
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: detailKey(suratId) })
    },
  })
}

export function useDeleteSuratItem(suratId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`/surat-items/${itemId}`)
      return itemId
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: detailKey(suratId) })
    },
  })
}

export function useReorderSuratItems(suratId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post(`/surat/${suratId}/items/reorder`, { ids })
      return ids
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: detailKey(suratId) })
    },
  })
}
