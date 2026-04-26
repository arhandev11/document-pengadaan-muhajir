import { FileText, Plus, ShieldCheck, Trash2 } from 'lucide-react'
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
import { useDeleteNda, useNdaByProject } from '@/hooks/use-nda'
import { useProjects } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import type { Nda } from '@/types/nda'

export default function NdaListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canCreate = hasPermission(user, 'nda.create')
  const { data: projects } = useProjects()
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project') ?? '')

  useEffect(() => {
    if (!selectedProject && projects?.data[0]) {
      const firstId = String(projects.data[0].id)
      setSelectedProject(firstId)
      setSearchParams({ project: firstId }, { replace: true })
    }
  }, [projects, selectedProject, setSearchParams])

  const { data, isLoading } = useNdaByProject(selectedProject || undefined)

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif mb-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Pernyataan Kerahasiaan (NDA)
          </h1>
          <p className="text-muted-foreground text-sm">
            Dilindungi UU No. 30/2000 · Pasal 1320 KUHPerdata
          </p>
        </div>
        {canCreate && selectedProject && (
          <Button asChild>
            <Link to={`/nda/new?project=${selectedProject}`}>
              <Plus className="w-4 h-4" />
              NDA Baru
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
          {data.data.map((n) => (
            <NdaCard key={n.id} nda={n} />
          ))}
        </div>
      )}
    </div>
  )
}

function NdaCard({ nda }: { nda: Nda }) {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const deleteNda = useDeleteNda()
  const canDelete = hasPermission(user, 'nda.delete')

  async function handleDelete() {
    try {
      await deleteNda.mutateAsync(nda.id)
      toast.success('NDA dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Card
      className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
      onClick={() => navigate(`/nda/${nda.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight truncate">
              {nda.nomor || <span className="text-muted-foreground italic">(Tanpa nomor)</span>}
            </CardTitle>
            <CardDescription className="mt-1 text-xs line-clamp-2">
              {nda.pihak_penerima.nama || 'Pihak Penerima belum diisi'}
            </CardDescription>
          </div>
          {nda.jangka_waktu && (
            <Badge variant="secondary" className="text-[10px] flex-shrink-0 whitespace-nowrap">
              {nda.jangka_waktu}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1">
        {nda.tanggal && <div>📅 {nda.tanggal}</div>}
        {nda.pihak_penerima.organisasi && <div>🏢 {nda.pihak_penerima.organisasi}</div>}
        <div className="pt-2 mt-2 border-t flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px]">
            <FileText className="w-3 h-3" />
            {nda.created_by?.name ?? '—'}
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
                    <AlertDialogTitle>Hapus NDA ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      NDA <strong>{nda.nomor || '(tanpa nomor)'}</strong> akan dihapus (soft delete).
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
      <div className="text-5xl mb-3">🔒</div>
      <div className="font-semibold mb-1">Belum ada NDA untuk project ini</div>
      <p className="text-sm text-muted-foreground mb-6">
        Buat NDA saat melibatkan pihak eksternal dengan akses ke informasi rahasia.
      </p>
      {canCreate && projectId && (
        <Button asChild>
          <Link to={`/nda/new?project=${projectId}`}>
            <Plus className="w-4 h-4" />
            Buat NDA Pertama
          </Link>
        </Button>
      )}
    </div>
  )
}
