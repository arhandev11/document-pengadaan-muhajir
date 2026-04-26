import { FileText, Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { useDeleteSurat, useSuratByProject } from '@/hooks/use-surat'
import { extractError } from '@/lib/api'
import { toRp } from '@/lib/currency'
import type { Surat } from '@/types/surat'

export default function SuratListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canCreate = hasPermission(user, 'surat.create')

  const { data: projects } = useProjects()
  const [selectedProject, setSelectedProject] = useState<string>(
    searchParams.get('project') ?? '',
  )

  // Auto-select project pertama kalau belum ada
  useEffect(() => {
    if (!selectedProject && projects?.data[0]) {
      const firstId = String(projects.data[0].id)
      setSelectedProject(firstId)
      setSearchParams({ project: firstId }, { replace: true })
    }
  }, [projects, selectedProject, setSearchParams])

  const { data, isLoading } = useSuratByProject(selectedProject || undefined)

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif mb-1">Surat Penawaran</h1>
          <p className="text-muted-foreground text-sm">
            Penawaran harga pengadaan barang, dikelompokkan per project.
          </p>
        </div>
        {canCreate && selectedProject && (
          <Button asChild>
            <Link to={`/surat/new?project=${selectedProject}`}>
              <Plus className="w-4 h-4" />
              Surat Baru
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Select
          value={selectedProject}
          onValueChange={(v) => {
            setSelectedProject(v)
            setSearchParams({ project: v })
          }}
        >
          <SelectTrigger className="w-full md:max-w-md">
            <SelectValue placeholder="Pilih project..." />
          </SelectTrigger>
          <SelectContent>
            {projects?.data.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.name} {p.spk.nomor && `— ${p.spk.nomor}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <ListSkeleton />}
      {!isLoading && data?.data.length === 0 && (
        <EmptyState canCreate={canCreate} projectId={selectedProject} />
      )}
      {!isLoading && data && data.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.data.map((s) => (
            <SuratCard key={s.id} surat={s} />
          ))}
        </div>
      )}
    </div>
  )
}

function SuratCard({ surat }: { surat: Surat }) {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const deleteSurat = useDeleteSurat()
  const canDelete = hasPermission(user, 'surat.delete')

  async function handleDelete() {
    try {
      await deleteSurat.mutateAsync(surat.id)
      toast.success('Surat dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Card
      className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
      onClick={() => navigate(`/surat/${surat.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">
              {surat.nomor || <span className="text-muted-foreground italic">(Tanpa nomor)</span>}
            </CardTitle>
            <CardDescription className="mt-1 text-xs line-clamp-2">
              {surat.perihal || 'Belum ada perihal'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            {surat.items.length} item
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1">
        {surat.tanggal && <div>📅 {surat.tanggal}</div>}
        {surat.grand_total != null && surat.grand_total > 0 && (
          <div>
            💰 <span className="text-primary font-semibold">Rp {toRp(surat.grand_total)}</span>
          </div>
        )}
        <div className="pt-2 mt-2 border-t flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <FileText className="w-3 h-3" />
            {surat.created_by?.name ?? '—'}
          </div>
          {canDelete && (
            <div onClick={(e) => e.stopPropagation()}>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus surat ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Surat <strong>{surat.nomor || '(tanpa nomor)'}</strong> akan dihapus (soft delete).
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function EmptyState({ canCreate, projectId }: { canCreate: boolean; projectId: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">📄</div>
      <div className="font-semibold mb-1">Belum ada surat penawaran untuk project ini</div>
      <p className="text-sm text-muted-foreground mb-6">
        Mulai dengan membuat surat penawaran pertama.
      </p>
      {canCreate && projectId && (
        <Button asChild>
          <Link to={`/surat/new?project=${projectId}`}>
            <Plus className="w-4 h-4" />
            Buat Surat Pertama
          </Link>
        </Button>
      )}
    </div>
  )
}
