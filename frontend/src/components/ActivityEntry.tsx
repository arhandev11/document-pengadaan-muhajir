import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileDown,
  Package,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useDeleteActivity } from '@/hooks/use-activity'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Activity } from '@/types/activity'

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; color: string }
> = {
  CREATE: { label: 'Dibuat', icon: Sparkles, bg: 'bg-green-100', color: 'text-green-700' },
  EDIT: { label: 'Diubah', icon: Pencil, bg: 'bg-amber-100', color: 'text-amber-700' },
  DELETE: { label: 'Dihapus', icon: Trash2, bg: 'bg-red-100', color: 'text-red-700' },
  RESTORE: { label: 'Dipulihkan', icon: RotateCcw, bg: 'bg-emerald-100', color: 'text-emerald-700' },
  PRINT: { label: 'Dicetak', icon: Printer, bg: 'bg-slate-100', color: 'text-slate-700' },
  EXPORT_PDF: { label: 'Ekspor PDF', icon: Download, bg: 'bg-blue-100', color: 'text-blue-700' },
  EXPORT_HTML: { label: 'Ekspor HTML', icon: Download, bg: 'bg-purple-100', color: 'text-purple-700' },
  EXPORT_JSON: { label: 'Ekspor JSON', icon: FileDown, bg: 'bg-teal-100', color: 'text-teal-700' },
  SNAPSHOT: { label: 'Snapshot', icon: Package, bg: 'bg-rose-100', color: 'text-rose-700' },
  UPLOADED: { label: 'Diunggah', icon: Plus, bg: 'bg-blue-100', color: 'text-blue-700' },
  REMOVED: { label: 'Dihapus', icon: X, bg: 'bg-red-100', color: 'text-red-700' },
  LEGACY_IMPORTED: { label: 'Import Legacy', icon: CheckCircle2, bg: 'bg-indigo-100', color: 'text-indigo-700' },
}

const DOC_TYPE_LABEL: Record<string, string> = {
  project: 'Setup Proyek',
  surat: 'Surat Penawaran',
  berita: 'Berita Acara',
  perjanjian: 'Perjanjian',
  nda: 'NDA',
  event: 'Event',
  logo: 'Logo',
  import: 'Import',
}

interface Props {
  activity: Activity
}

export function ActivityEntry({ activity }: Props) {
  const [open, setOpen] = useState(false)
  const { data: user } = useCurrentUser()
  const canDelete = hasPermission(user, 'activity.delete')
  const deleteActivity = useDeleteActivity()

  const cfg = ACTION_CONFIG[activity.action] ?? {
    label: activity.action,
    icon: Pencil,
    bg: 'bg-muted',
    color: 'text-muted-foreground',
  }
  const Icon = cfg.icon

  const hasChanges = Boolean(activity.changes?.attributes || activity.changes?.old)
  const hasProperties = Boolean(activity.properties && Object.keys(activity.properties).length > 0)
  const expandable = hasChanges || hasProperties

  async function handleDelete() {
    try {
      await deleteActivity.mutateAsync(activity.id)
      toast.success('Entri dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div
        className={cn(
          'flex items-start gap-3 px-4 py-3',
          expandable && 'cursor-pointer hover:bg-muted/50',
        )}
        onClick={() => expandable && setOpen((v) => !v)}
      >
        <div className={cn('w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0', cfg.bg)}>
          <Icon className={cn('w-4 h-4', cfg.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{cfg.label}</span>
            <Badge variant="secondary" className="text-[10px]">
              {DOC_TYPE_LABEL[activity.doc_type] ?? activity.doc_type}
            </Badge>
            {activity.subject_id && (
              <span className="text-[11px] text-muted-foreground font-mono">#{activity.subject_id}</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {activity.description}
          </div>
        </div>

        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
          <div className="text-[11px] text-muted-foreground">
            {formatDateTime(activity.created_at)}
          </div>
          <div className="flex items-center gap-1">
            {activity.causer && (
              <span className="text-[10px] text-muted-foreground">{activity.causer.name}</span>
            )}
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus entri ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Entri <strong>{cfg.label}</strong> tidak bisa dikembalikan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {expandable &&
              (open ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              ))}
          </div>
        </div>
      </div>

      {expandable && open && (
        <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
          {hasChanges && <ChangesDiff changes={activity.changes!} />}
          {hasProperties && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
                Properties
              </div>
              <pre className="text-[11px] leading-relaxed bg-card rounded p-2 overflow-auto max-h-40">
                {JSON.stringify(activity.properties, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChangesDiff({ changes }: { changes: NonNullable<Activity['changes']> }) {
  const allKeys = new Set([
    ...Object.keys(changes.attributes ?? {}),
    ...Object.keys(changes.old ?? {}),
  ])

  if (allKeys.size === 0) return null

  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">
        Perubahan Field
      </div>
      <div className="space-y-1.5">
        {[...allKeys].map((field) => {
          const from = changes.old?.[field]
          const to = changes.attributes?.[field]
          return (
            <div key={field} className="flex items-start gap-2 text-[11px]">
              <span className="font-mono text-muted-foreground w-32 flex-shrink-0 truncate">{field}</span>
              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 max-w-[40%] truncate">
                {formatValue(from)}
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 max-w-[40%] truncate">
                {formatValue(to)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatValue(v: unknown): string {
  if (v === undefined || v === null) return '—'
  if (typeof v === 'string') return v.length > 40 ? `${v.slice(0, 40)}…` : v || '(kosong)'
  return JSON.stringify(v).slice(0, 40)
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}
