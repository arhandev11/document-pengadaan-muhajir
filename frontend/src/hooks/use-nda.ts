import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Nda, NdaInput } from '@/types/nda'
import type { Paginated } from '@/types/project'

const LIST_KEY = ['nda'] as const
const detailKey = (id: number | string) => ['nda', Number(id)] as const

export function useNdaByProject(projectId: number | string | undefined) {
  return useQuery({
    queryKey: [...LIST_KEY, 'byProject', projectId ? Number(projectId) : null],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Nda>>(`/projects/${projectId}/nda`)
      return data
    },
    enabled: projectId !== undefined,
  })
}

export function useNda(id: number | string | undefined) {
  return useQuery({
    queryKey: detailKey(id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<{ data: Nda }>(`/nda/${id}`)
      return data.data
    },
    enabled: id !== undefined && id !== 'new',
  })
}

export function useCreateNda(projectId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: NdaInput) => {
      const { data } = await api.post<{ data: Nda }>(`/projects/${projectId}/nda`, payload)
      return data.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}

export function useUpdateNda(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: NdaInput) => {
      const { data } = await api.patch<{ data: Nda }>(`/nda/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useDeleteNda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/nda/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LIST_KEY }),
  })
}
