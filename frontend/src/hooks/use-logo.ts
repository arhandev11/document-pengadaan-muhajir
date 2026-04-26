import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { LogoInfo } from '@/types/logo'

const LOGO_KEY = ['logo'] as const

export function useLogo() {
  return useQuery({
    queryKey: LOGO_KEY,
    queryFn: async () => {
      const { data } = await api.get<LogoInfo>('/logo')
      return data
    },
  })
}

export function useUploadLogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      // Override Content-Type agar axios pakai multipart dengan boundary otomatis
      const { data } = await api.post<{ message: string; url: string; size_bytes: number }>(
        '/logo',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LOGO_KEY }),
  })
}

export function useRemoveLogo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete('/logo')
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LOGO_KEY }),
  })
}
