import { FileText, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useDeleteProject, useProjects } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import type { Project } from '@/types/project'

export default function ProjectListPage() {
  const { data: user } = useCurrentUser()
  const [q, setQ] = useState('')
  const { data, isLoading } = useProjects({ q: q || undefined })
  const canCreate = hasPermission(user, 'project.create')

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-serif mb-1">Setup Proyek</h1>
          <p className="text-muted-foreground text-sm">
            Data pihak digunakan bersama di seluruh dokumen terkait.
          </p>
        </div>
        {canCreate && (
          <Button asChild>
            <Link to="/projects/new">
              <Plus className="w-4 h-4" />
              Project Baru
            </Link>
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari nama project, nomor SPK, atau organisasi..."
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {isLoading && <ProjectListSkeleton />}
      {!isLoading && data?.data.length === 0 && (
        <EmptyState canCreate={canCreate} q={q} />
      )}
      {!isLoading && data && data.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.data.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {data && data.meta.total > 0 && (
        <div className="mt-6 text-xs text-muted-foreground text-center">
          {data.meta.total} project · halaman {data.meta.current_page} dari {data.meta.last_page}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { data: user } = useCurrentUser()
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()
  const canDelete = hasPermission(user, 'project.delete')

  async function handleDelete() {
    try {
      await deleteProject.mutateAsync(project.id)
      toast.success('Project dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Card
      className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">
              {project.name}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">
              {project.p2.organisasi || 'Belum ada pihak kedua'}
            </CardDescription>
          </div>
          {project.spk.nomor && (
            <Badge variant="secondary" className="text-[10px] font-mono flex-shrink-0">
              SPK
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1">
        {project.spk.nomor && (
          <div className="truncate">
            <strong className="text-foreground">No. SPK:</strong> {project.spk.nomor}
          </div>
        )}
        {project.spk.tanggal && (
          <div>
            <strong className="text-foreground">Tanggal:</strong> {project.spk.tanggal}
          </div>
        )}
        <div className="pt-2 mt-2 border-t flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <FileText className="w-3 h-3" />
            {project.created_by?.name ?? 'Unknown'}
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
                    <AlertDialogTitle>Hapus project ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Project <strong>{project.name}</strong> akan dihapus (soft delete).
                      Dokumen terkait akan ikut terhapus. Tindakan dapat dibatalkan via
                      snapshot terakhir.
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

function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
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

function EmptyState({ canCreate, q }: { canCreate: boolean; q: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-3">📂</div>
      <div className="font-semibold mb-1">
        {q ? `Tidak ada project cocok dengan "${q}"` : 'Belum ada project'}
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        {q
          ? 'Coba kata kunci lain atau bersihkan pencarian.'
          : 'Mulai dengan membuat project pengadaan pertama Anda.'}
      </p>
      {canCreate && !q && (
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="w-4 h-4" />
            Buat Project Pertama
          </Link>
        </Button>
      )}
    </div>
  )
}
