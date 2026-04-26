import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, tokenStorage } from '@/lib/api'
import type { LoginPayload, LoginResponse, User } from '@/types/auth'

const QUERY_KEY_ME = ['auth', 'me'] as const

/**
 * Fetch current authenticated user — `null` kalau belum login.
 * Dipakai App.tsx untuk decide route guard.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEY_ME,
    queryFn: async (): Promise<User | null> => {
      if (!tokenStorage.get()) return null
      const { data } = await api.get<User>('/auth/me')
      return data
    },
    staleTime: 60_000,
    retry: false,
  })
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      tokenStorage.set(data.token)
      qc.setQueryData(QUERY_KEY_ME, data.user)
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout')
      } catch {
        // Ignore network errors — we still clear local state
      }
    },
    onSettled: () => {
      tokenStorage.clear()
      qc.setQueryData(QUERY_KEY_ME, null)
      qc.clear()
    },
  })
}

/** Helper to check permission in components */
export function hasPermission(user: User | null | undefined, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false
}
