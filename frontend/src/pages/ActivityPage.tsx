import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ActivityEntry } from '@/components/ActivityEntry'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useActivity, useActivityStats, useClearActivity } from '@/hooks/use-activity'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { ActivityDocType } from '@/types/activity'

const FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Semua' },
  { value: 'project', label: 'Setup Proyek' },
  { value: 'surat', label: 'Surat Penawaran' },
  { value: 'berita', label: 'Berita Acara' },
  { value: 'perjanjian', label: 'Perjanjian' },
  { value: 'nda', label: 'NDA' },
]

export default function ActivityPage() {
  const { data: user } = useCurrentUser()
  const canDelete = hasPermission(user, 'activity.delete')
  // Persist filter ke localStorage — closes PRD §15.7
  const [docTypeFilter, setDocTypeFilter] = usePersistedState<string>('activity.filter', '')

  const { data: stats } = useActivityStats()
  const { data, isLoading } = useActivity({
    doc_type: docTypeFilter ? (docTypeFilter as ActivityDocType) : undefined,
    per_page: 30,
  })

  const clearAll = useClearActivity()

  async function handleClearAll() {
    try {
      const res = await clearAll.mutateAsync()
      toast.success(res.message)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif mb-1">Riwayat Aktivitas</h1>
          <p className="text-muted-foreground text-sm">
            Audit trail seluruh perubahan dokumen & aksi user.
          </p>
        </div>
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                Hapus Semua
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus semua riwayat?</AlertDialogTitle>
                <AlertDialogDescription>
                  Seluruh <strong>{stats?.total ?? 0}</strong> entri aktivitas akan dihapus
                  permanen. Tindakan tidak bisa dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus Semua
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Aktivitas" value={stats?.total} color="text-foreground" />
        <StatCard
          label="Edit & Buat"
          value={(stats?.by_action.CREATE ?? 0) + (stats?.by_action.EDIT ?? 0)}
          color="text-primary"
        />
        <StatCard
          label="Ekspor & Cetak"
          value={
            (stats?.by_action.PRINT ?? 0) +
            (stats?.by_action.EXPORT_PDF ?? 0) +
            (stats?.by_action.EXPORT_HTML ?? 0) +
            (stats?.by_action.EXPORT_JSON ?? 0)
          }
          color="text-blue-600"
        />
        <StatCard label="1 Jam Terakhir" value={stats?.recent_1h} color="text-emerald-600" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-1 bg-card p-1 rounded-lg border border-border mb-6 w-fit overflow-x-auto">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDocTypeFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap',
              docTypeFilter === opt.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
            {opt.value && stats?.by_doc_type[opt.value] !== undefined && (
              <span className="ml-1.5 opacity-70">({stats.by_doc_type[opt.value]})</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && data?.data.length === 0 && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="text-5xl mb-3">🕒</div>
            <div className="font-semibold mb-1">Belum ada aktivitas</div>
            <p className="text-sm text-muted-foreground">
              Aktivitas akan tercatat otomatis saat Anda membuat atau mengubah dokumen.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && data.data.length > 0 && (
        <div className="space-y-6">
          {groupByDay(data.data).map(([day, entries]) => (
            <div key={day}>
              <DaySeparator day={day} count={entries.length} />
              <div className="space-y-2">
                {entries.map((activity) => (
                  <ActivityEntry key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}

          {data.meta.total > data.data.length && (
            <div className="text-center pt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Menampilkan {data.data.length} dari {data.meta.total} entri
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Group entries by tanggal (id-ID format), ordered descending.
 * Mirror Doc Manager.html renderHistoryList line 1148-1152.
 */
function groupByDay<T extends { created_at: string | null }>(items: T[]): Array<[string, T[]]> {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const day = item.created_at ? formatDay(item.created_at) : 'Tanpa tanggal'
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(item)
  }
  return [...groups.entries()]
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function DaySeparator({ day, count }: { day: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">
        {day}
      </span>
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground whitespace-nowrap">
        {count} aktivitas
      </span>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number | undefined; color: string }) {
  return (
    <Card className="p-4">
      <div className={cn('text-xl font-extrabold leading-tight', color)}>
        {value ?? <Skeleton className="h-7 w-12 inline-block" />}
      </div>
      <div className="text-[11px] font-medium text-muted-foreground mt-0.5">{label}</div>
    </Card>
  )
}
