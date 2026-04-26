import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Paginated, Project, ProjectInput } from '@/types/project'

const LIST_KEY = ['projects'] as const
const detailKey = (id: number | string) => ['projects', Number(id)] as const

export function useProjects(params: { q?: string; per_page?: number } = {}) {
  return useQuery({
    queryKey: [...LIST_KEY, params],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Project>>('/projects', { params })
      return data
    },
  })
}

export function useProject(id: number | string | undefined) {
  return useQuery({
    queryKey: detailKey(id ?? 0),
    queryFn: async () => {
      const { data } = await api.get<{ data: Project }>(`/projects/${id}`)
      return data.data
    },
    enabled: id !== undefined && id !== 'new',
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProjectInput) => {
      const { data } = await api.post<{ data: Project }>('/projects', payload)
      return data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useUpdateProject(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<ProjectInput>) => {
      const { data } = await api.patch<{ data: Project }>(`/projects/${id}`, payload)
      return data.data
    },
    onSuccess: (data) => {
      qc.setQueryData(detailKey(id), data)
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/projects/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}
