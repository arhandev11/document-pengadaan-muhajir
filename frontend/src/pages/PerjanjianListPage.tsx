import { FileText, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { useDeletePerjanjian, usePerjanjianByProject } from '@/hooks/use-perjanjian'
import { useProjects } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Perjanjian } from '@/types/perjanjian'

export default function PerjanjianListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canCreate = hasPermission(user, 'perjanjian.create')
  const { data: projects } = useProjects()
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project') ?? '')

  useEffect(() => {
    if (!selectedProject && projects?.data[0]) {
      const firstId = String(projects.data[0].id)
      setSelectedProject(firstId)
      setSearchParams({ project: firstId }, { replace: true })
    }
  }, [projects, selectedProject, setSearchParams])

  const { data, isLoading } = usePerjanjianByProject(selectedProject || undefined)

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif mb-1">Perjanjian Kerjasama</h1>
          <p className="text-muted-foreground text-sm">
            Perjanjian pengadaan barang atau jasa dengan hirarki pasal → poin → sub-poin.
          </p>
        </div>
        {canCreate && selectedProject && (
          <Button asChild>
            <Link to={`/perjanjian/new?project=${selectedProject}`}>
              <Plus className="w-4 h-4" />
              Perjanjian Baru
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
          {data.data.map((p) => (
            <PerjanjianCard key={p.id} perjanjian={p} />
          ))}
        </div>
      )}
    </div>
  )
}

function PerjanjianCard({ perjanjian }: { perjanjian: Perjanjian }) {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const deletePerjanjian = useDeletePerjanjian()
  const canDelete = hasPermission(user, 'perjanjian.delete')

  async function handleDelete() {
    try {
      await deletePerjanjian.mutateAsync(perjanjian.id)
      toast.success('Perjanjian dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Card
      className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
      onClick={() => navigate(`/perjanjian/${perjanjian.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">
              {perjanjian.judul || <span className="text-muted-foreground italic">Tanpa judul</span>}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              {perjanjian.nomor || '(Tanpa nomor)'}
            </CardDescription>
          </div>
          <Badge
            className={cn(
              'text-[10px] flex-shrink-0',
              perjanjian.tipe === 'jasa'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200'
                : 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
            )}
          >
            {perjanjian.tipe === 'jasa' ? 'Jasa' : 'Barang'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1">
        {perjanjian.tanggal && <div>📅 {perjanjian.tanggal}</div>}
        <div>
          📑{' '}
          <span className="text-foreground font-semibold">
            {perjanjian.pasal_count ?? perjanjian.pasal.length}
          </span>{' '}
          pasal
        </div>
        <div className="pt-2 mt-2 border-t flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <FileText className="w-3 h-3" />
            {perjanjian.created_by?.name ?? '—'}
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
                    <AlertDialogTitle>Hapus perjanjian ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Perjanjian <strong>{perjanjian.nomor || '(tanpa nomor)'}</strong> beserta
                      semua pasal akan dihapus (soft delete).
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
      <div className="text-5xl mb-3">📝</div>
      <div className="font-semibold mb-1">Belum ada perjanjian untuk project ini</div>
      <p className="text-sm text-muted-foreground mb-6">
        Mulai dengan template Barang atau Jasa yang akan apply 13/12 pasal otomatis.
      </p>
      {canCreate && projectId && (
        <Button asChild>
          <Link to={`/perjanjian/new?project=${projectId}`}>
            <Plus className="w-4 h-4" />
            Buat Perjanjian Pertama
          </Link>
        </Button>
      )}
    </div>
  )
}
