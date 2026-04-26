import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/AppLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
// LoginPage tetap eager (tidak butuh code-split — kecil & first paint matters)
import LoginPage from '@/pages/LoginPage'

// Code-split per route — initial bundle hanya berisi shell + login
const ProjectListPage = lazy(() => import('@/pages/ProjectListPage'))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'))
const SuratListPage = lazy(() => import('@/pages/SuratListPage'))
const SuratDetailPage = lazy(() => import('@/pages/SuratDetailPage'))
const BeritaListPage = lazy(() => import('@/pages/BeritaListPage'))
const BeritaDetailPage = lazy(() => import('@/pages/BeritaDetailPage'))
const PerjanjianListPage = lazy(() => import('@/pages/PerjanjianListPage'))
const PerjanjianDetailPage = lazy(() => import('@/pages/PerjanjianDetailPage'))
const NdaListPage = lazy(() => import('@/pages/NdaListPage'))
const NdaDetailPage = lazy(() => import('@/pages/NdaDetailPage'))
const ActivityPage = lazy(() => import('@/pages/ActivityPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<ProjectListPage />} />
                <Route path="/projects/new" element={<ProjectDetailPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/surat" element={<SuratListPage />} />
                <Route path="/surat/new" element={<SuratDetailPage />} />
                <Route path="/surat/:id" element={<SuratDetailPage />} />
                <Route path="/berita" element={<BeritaListPage />} />
                <Route path="/berita/new" element={<BeritaDetailPage />} />
                <Route path="/berita/:id" element={<BeritaDetailPage />} />
                <Route path="/perjanjian" element={<PerjanjianListPage />} />
                <Route path="/perjanjian/new" element={<PerjanjianDetailPage />} />
                <Route path="/perjanjian/:id" element={<PerjanjianDetailPage />} />
                <Route path="/nda" element={<NdaListPage />} />
                <Route path="/nda/new" element={<NdaDetailPage />} />
                <Route path="/nda/:id" element={<NdaDetailPage />} />
                <Route path="/history" element={<ActivityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
