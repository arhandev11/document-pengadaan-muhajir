import { Image as ImageIcon, Loader2, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
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
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useLogo, useRemoveLogo, useUploadLogo } from '@/hooks/use-logo'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'

const MAX_SIZE_MB = 2
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml']

export default function SettingsPage() {
  const { data: user } = useCurrentUser()
  const canManage = hasPermission(user, 'logo.manage')
  const { data: logo, isLoading } = useLogo()
  const uploadLogo = useUploadLogo()
  const removeLogo = useRemoveLogo()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleUpload(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('File harus PNG, JPG, atau SVG.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Ukuran file maksimum ${MAX_SIZE_MB}MB.`)
      return
    }
    try {
      await uploadLogo.mutateAsync(file)
      toast.success('Logo berhasil diunggah.')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleRemove() {
    try {
      await removeLogo.mutateAsync()
      toast.success('Logo dihapus.')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    e.target.value = '' // reset agar file sama bisa di-upload ulang
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-serif mb-1">Pengaturan</h1>
        <p className="text-muted-foreground text-sm">Konfigurasi aplikasi & aset bersama.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Logo Kop Surat
          </CardTitle>
          <CardDescription>
            Tampil di pojok kanan atas Surat Penawaran & Berita Acara saat cetak/PDF.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : logo?.url ? (
            <LogoPreview
              logo={logo}
              canManage={canManage}
              onReplace={() => fileInputRef.current?.click()}
              onRemove={handleRemove}
              isUploading={uploadLogo.isPending || removeLogo.isPending}
            />
          ) : (
            <DropZone
              canManage={canManage}
              dragOver={dragOver}
              onDragOver={(e) => {
                e.preventDefault()
                if (canManage) setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={canManage ? handleDrop : undefined}
              onClick={() => canManage && fileInputRef.current?.click()}
              isUploading={uploadLogo.isPending}
            />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={handleFileInput}
            disabled={!canManage}
          />

          {!canManage && (
            <div className="mt-4 rounded-md bg-muted text-muted-foreground text-xs p-3">
              Hanya admin yang dapat mengubah logo. Role Anda: <strong>{user?.roles.join(', ')}</strong>.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LogoPreview({
  logo,
  canManage,
  onReplace,
  onRemove,
  isUploading,
}: {
  logo: { url: string | null; original_name: string | null; size_bytes: number | null }
  canManage: boolean
  onReplace: () => void
  onRemove: () => void
  isUploading: boolean
}) {
  if (!logo.url) return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-muted/40 border border-border p-6 flex items-center justify-center">
        <img
          src={logo.url}
          alt="Logo aplikasi"
          className="max-h-24 max-w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="text-muted-foreground">
          <div className="font-medium text-foreground">{logo.original_name ?? 'logo'}</div>
          <div>{formatBytes(logo.size_bytes)}</div>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onReplace} disabled={isUploading}>
              {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <Upload className="w-3.5 h-3.5" />
              Ganti
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus logo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Logo akan dihapus dari seluruh dokumen. Anda bisa upload ulang kapan saja.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onRemove}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  )
}

function DropZone({
  canManage,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  isUploading,
}: {
  canManage: boolean
  dragOver: boolean
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
  isUploading: boolean
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 border-dashed p-10 text-center transition-colors',
        canManage ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
        dragOver ? 'border-primary bg-secondary/40' : 'border-border bg-muted/30 hover:border-primary/40',
      )}
    >
      {isUploading ? (
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
      ) : (
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      )}
      <div className="font-semibold text-sm mb-1">
        {canManage ? 'Klik atau drop file di sini' : 'Belum ada logo'}
      </div>
      <div className="text-xs text-muted-foreground">
        PNG, JPG, atau SVG · maks. {MAX_SIZE_MB}MB
      </div>
    </div>
  )
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
