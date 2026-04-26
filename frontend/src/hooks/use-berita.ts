import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  Berita,
  BeritaCreateInput,
  BeritaHeaderInput,
  BeritaItem,
  BeritaItemInput,
} from '@/types/berita'
import type { Paginated } from '@/types/project'

const LIST_KEY = ['berita'] as const
const detailKey = (id: number | string) => ['berita', Number(id)] as const

export function useBeritaByProject(projectId: number | string | undefined) {
  return useQuery({
    queryKey: [...LIST_KEY, 'byProject', projectId ? Number(projectId) : null],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Berita>>(`/projects/${projectId}/berita`)
      return data
    },
    enabled: projectId !== undefined,
  })
}

export function useBerita(id: number | string | undefined) {
  return useQuery({
    queryKey: detailKey(id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<{ data: Berita }>(`/berita/${id}`)
      return data.data
    },
    enabled: id !== undefined && id !== 'new',
  })
}

export function useCreateBerita(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: BeritaCreateInput) => {
      const { data } = await api.post<{ data: Berita }>(
        `/projects/${projectId}/berita`,
        payload,
      )
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}

export function useUpdateBerita(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: BeritaHeaderInput) => {
      const { data } = await api.patch<{ data: Berita }>(`/berita/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useDeleteBerita() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/berita/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}

// ── Items ────────────────────────────────────────────────────────────

export function useAddBeritaItem(beritaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: BeritaItemInput) => {
      const { data } = await api.post<{ data: BeritaItem }>(
        `/berita/${beritaId}/items`,
        payload,
      )
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(beritaId) }),
  })
}

export function useUpdateBeritaItem(beritaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, payload }: { itemId: number; payload: BeritaItemInput }) => {
      const { data } = await api.patch<{ data: BeritaItem }>(
        `/berita-items/${itemId}`,
        payload,
      )
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(beritaId) }),
  })
}

export function useDeleteBeritaItem(beritaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (itemId: number) => {
      await api.delete(`/berita-items/${itemId}`)
      return itemId
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(beritaId) }),
  })
}

export function useReorderBeritaItems(beritaId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await api.post(`/berita/${beritaId}/items/reorder`, { ids })
      return ids
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(beritaId) }),
  })
}
