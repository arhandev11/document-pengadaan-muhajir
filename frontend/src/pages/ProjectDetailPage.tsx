import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ProjectForm } from '@/components/ProjectForm'
import { SnapshotsPanel } from '@/components/SnapshotsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useCreateProject, useProject, useUpdateProject } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import type { ProjectInput } from '@/types/project'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const canEdit = hasPermission(user, isNew ? 'project.create' : 'project.update')

  const { data: project, isLoading } = useProject(id)
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject(Number(id ?? 0))

  async function handleSubmit(values: ProjectInput) {
    try {
      if (isNew) {
        const created = await createMutation.mutateAsync(values)
        toast.success(`Project "${created.name}" dibuat`)
        navigate(`/projects/${created.id}`, { replace: true })
      } else {
        await updateMutation.mutateAsync(values)
        toast.success('Perubahan tersimpan')
      }
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  if (!isNew && isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-md bg-destructive/10 text-destructive p-4 text-sm">
          Anda tidak memiliki izin untuk {isNew ? 'membuat' : 'mengedit'} project.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="text-2xl font-serif">
          {isNew ? 'Project Baru' : project?.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isNew
            ? 'Isi data pihak dan SPK — bisa diedit kapan saja.'
            : `Dibuat oleh ${project?.created_by?.name ?? '—'} · ${project?.created_at?.slice(0, 10)}`}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            submitLabel={isNew ? 'Buat Project' : 'Simpan Perubahan'}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </CardContent>
      </Card>

      {!isNew && project && (
        <>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Dokumen Terkait</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <DocLink to={`/surat?project=${project.id}`} label="Surat Penawaran" emoji="📄" />
                <DocLink to={`/berita?project=${project.id}`} label="Berita Acara" emoji="📋" />
                <DocLink to={`/perjanjian?project=${project.id}`} label="Perjanjian" emoji="📝" />
                <DocLink to={`/nda?project=${project.id}`} label="NDA" emoji="🔒" />
              </div>
            </CardContent>
          </Card>
          <div className="mt-6">
            <SnapshotsPanel type="projects" id={project.id} entityLabel="project" />
          </div>
        </>
      )}
    </div>
  )
}

function DocLink({ to, label, emoji }: { to: string; label: string; emoji: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-md border border-border bg-muted/30 hover:bg-secondary hover:border-primary/30 transition-colors text-center"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
