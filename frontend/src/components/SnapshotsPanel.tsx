import { Camera, Clock, Loader2, RotateCcw, Trash2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import {
  useCreateSnapshot,
  useDeleteSnapshot,
  useRestoreSnapshot,
  useSnapshots,
} from '@/hooks/use-snapshots'
import { extractError } from '@/lib/api'
import type { SnapshotableType } from '@/types/snapshot'

interface Props {
  type: SnapshotableType
  id: number
  entityLabel: string
}

export function SnapshotsPanel({ type, id, entityLabel }: Props) {
  const { data: user } = useCurrentUser()
  const canCreate = hasPermission(user, 'snapshot.create')
  const canRestore = hasPermission(user, 'snapshot.restore')
  const canDelete = hasPermission(user, 'snapshot.delete')

  const { data, isLoading } = useSnapshots(type, id)
  const createSnap = useCreateSnapshot(type, id)
  const restoreSnap = useRestoreSnapshot()
  const deleteSnap = useDeleteSnapshot(type, id)

  const [label, setLabel] = useState('')
  const [showInput, setShowInput] = useState(false)

  async function handleCreate() {
    try {
      await createSnap.mutateAsync(label)
      toast.success('Snapshot tersimpan')
      setLabel('')
      setShowInput(false)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleRestore(snapshotId: number, snapLabel: string) {
    try {
      await restoreSnap.mutateAsync(snapshotId)
      toast.success(`Data dipulihkan dari: ${snapLabel}`)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleDelete(snapshotId: number) {
    try {
      await deleteSnap.mutateAsync(snapshotId)
      toast.success('Snapshot dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Snapshot & Pemulihan
        </CardTitle>
        <CardDescription>
          Simpan titik pemulihan sebelum perubahan besar. Restore mengembalikan seluruh
          state {entityLabel} ke momen snapshot diambil.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Create */}
        {canCreate && (
          <div className="mb-4">
            {showInput ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Label snapshot (opsional)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="text-xs h-8"
                  autoFocus
                />
                <Button size="sm" onClick={handleCreate} disabled={createSnap.isPending}>
                  {createSnap.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setShowInput(false); setLabel('') }}>
                  Batal
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowInput(true)}
                disabled={createSnap.isPending}
              >
                <Camera className="w-3.5 h-3.5" />
                Ambil Snapshot Sekarang
              </Button>
            )}
          </div>
        )}

        {/* List */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && data?.data.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-6 rounded-md bg-muted/30 border border-dashed">
            Belum ada snapshot. Ambil satu sebelum membuat perubahan besar.
          </div>
        )}

        {!isLoading && data && data.data.length > 0 && (
          <div className="space-y-2">
            {data.data.map((snap) => (
              <div
                key={snap.id}
                className="rounded-md border border-border bg-muted/30 p-3 flex items-start gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{snap.label}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(snap.created_at)}
                    {snap.created_by && <>· {snap.created_by.name}</>}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
                    hash: {snap.data_hash.slice(0, 12)}…
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {canRestore && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[10px] text-emerald-700 hover:text-emerald-700 hover:bg-emerald-50"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Pulihkan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Pulihkan dari snapshot ini?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Seluruh {entityLabel} akan dikembalikan ke state saat snapshot
                            <strong> "{snap.label}"</strong> diambil. Perubahan yang dibuat setelah
                            snapshot akan hilang. Pertimbangkan ambil snapshot baru dulu jika
                            belum yakin.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRestore(snap.id, snap.label)}>
                            Ya, pulihkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(snap.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return (
    d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  )
}
