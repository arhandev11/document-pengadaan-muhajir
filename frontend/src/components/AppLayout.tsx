import { FileText, Handshake, History, LogOut, ScrollText, Settings, ShieldCheck, Sliders } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useActivityStats } from '@/hooks/use-activity'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: typeof Settings
  /** Key di stats.by_doc_type untuk dot indicator (kalau >0 → dot hijau) */
  docTypeKey?: 'project' | 'surat' | 'berita' | 'perjanjian' | 'nda'
  /** Tab Riwayat menampilkan count "1 jam terakhir" */
  showRecentBadge?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Setup Proyek', icon: Settings, docTypeKey: 'project' },
  { to: '/surat', label: 'Surat Penawaran', icon: FileText, docTypeKey: 'surat' },
  { to: '/berita', label: 'Berita Acara', icon: ScrollText, docTypeKey: 'berita' },
  { to: '/perjanjian', label: 'Perjanjian', icon: Handshake, docTypeKey: 'perjanjian' },
  { to: '/nda', label: 'NDA', icon: ShieldCheck, docTypeKey: 'nda' },
  { to: '/history', label: 'Riwayat', icon: History, showRecentBadge: true },
]

export default function AppLayout() {
  const { data: user } = useCurrentUser()
  const { data: stats } = useActivityStats()
  const logout = useLogout()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout.mutateAsync()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Topbar */}
      <header className="h-14 bg-[#0f0d0b] text-white flex items-center justify-between px-6 flex-shrink-0 no-print">
        <Link to="/" className="flex items-center">
          <div>
            <div className="text-sm font-bold">Doc Manager</div>
            <div className="text-[10px] tracking-wider uppercase text-white/50">Document Management System</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium">{user.name}</div>
              <div className="text-[10px] text-white/50 capitalize">{user.roles.join(', ')}</div>
            </div>
          )}
          <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <Link to="/settings">
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Pengaturan</span>
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="h-12 bg-card border-b border-border flex items-end px-6 gap-1 overflow-x-auto flex-shrink-0 no-print">
        {NAV_ITEMS.map(({ to, label, icon: Icon, docTypeKey, showRecentBadge }) => {
          const hasActivity = docTypeKey ? (stats?.by_doc_type[docTypeKey] ?? 0) > 0 : false
          const recentCount = showRecentBadge ? (stats?.recent_1h ?? 0) : 0

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>

              {/* Status dot untuk dokumen — green saat ada aktivitas */}
              {docTypeKey && (
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    hasActivity ? 'bg-emerald-500' : 'bg-border',
                  )}
                  title={hasActivity ? 'Sudah ada dokumen' : 'Belum ada aktivitas'}
                  aria-label={hasActivity ? 'Sudah ada dokumen' : 'Belum ada aktivitas'}
                />
              )}

              {/* Recent badge untuk Riwayat */}
              {showRecentBadge && recentCount > 0 && (
                <span
                  className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  title={`${recentCount} aktivitas dalam 1 jam terakhir`}
                >
                  {recentCount > 99 ? '99+' : recentCount}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
