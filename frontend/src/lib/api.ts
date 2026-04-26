import axios, { AxiosError, type AxiosInstance } from 'axios'

const TOKEN_STORAGE_KEY = 'doc_manager_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach bearer token on every request
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — token expired / invalid → clear + redirect
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

// Type guard — handy for extracting Laravel validation errors
export interface LaravelError {
  message: string
  errors?: Record<string, string[]>
}

export function extractError(error: unknown): string {
  if (axios.isAxiosError<LaravelError>(error)) {
    const data = error.response?.data
    if (data?.errors) {
      return Object.values(data.errors).flat().join(', ')
    }
    return data?.message ?? error.message
  }
  return error instanceof Error ? error.message : 'Unknown error'
}
