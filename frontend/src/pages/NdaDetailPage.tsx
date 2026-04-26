import { ArrowLeft, Eye, Loader2, Pencil } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DocActionsBar } from '@/components/DocActionsBar'
import { NdaForm } from '@/components/NdaForm'
import { NdaPreview } from '@/components/preview/NdaPreview'
import { SnapshotsPanel } from '@/components/SnapshotsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useCreateNda, useNda, useUpdateNda } from '@/hooks/use-nda'
import { useProject } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import type { NdaInput } from '@/types/nda'

export default function NdaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canEdit = hasPermission(user, isNew ? 'nda.create' : 'nda.update')

  const { data: nda, isLoading } = useNda(id)
  const projectIdForCreate = searchParams.get('project')
  const { data: projectForCreate } = useProject(isNew ? projectIdForCreate ?? undefined : undefined)
  const { data: projectForEdit } = useProject(nda?.project_id)

  const createNda = useCreateNda(Number(projectIdForCreate ?? 0))
  const updateNda = useUpdateNda(Number(id ?? 0))

  const project = isNew ? projectForCreate : projectForEdit

  async function handleSubmit(values: NdaInput) {
    try {
      if (isNew) {
        if (!projectIdForCreate) {
          toast.error('Project tidak dipilih.')
          return
        }
        const created = await createNda.mutateAsync(values)
        toast.success('NDA dibuat')
        navigate(`/nda/${created.id}`, { replace: true })
      } else {
        await updateNda.mutateAsync(values)
        toast.success('Perubahan tersimpan')
      }
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  if (isNew && !projectIdForCreate) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-md bg-destructive/10 text-destructive p-4 text-sm">
          Pilih project dulu sebelum membuat NDA.{' '}
          <Link to="/nda" className="underline font-semibold">
            Kembali
          </Link>
        </div>
      </div>
    )
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
          Anda tidak memiliki izin untuk {isNew ? 'membuat' : 'mengedit'} NDA.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6 no-print">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/nda?project=${project?.id ?? ''}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </Button>
        <h1 className="text-2xl font-serif">
          {isNew ? 'NDA Baru' : (nda?.nomor || 'Pernyataan Kerahasiaan')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project: <strong>{project?.name ?? '—'}</strong>
          {project?.p1.perusahaan && <> · pengungkap {project.p1.perusahaan}</>}
        </p>
      </div>

      {!isNew && nda && (
        <div className="mb-4 no-print">
          <DocActionsBar
            subjectType="nda"
            subjectId={nda.id}
            data={nda}
            filenamePrefix={`NDA_${nda.nomor || nda.id}`}
          />
        </div>
      )}

      {isNew || !nda ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data NDA</CardTitle>
            <CardDescription>Isi pihak penerima dan konteks kerahasiaan.</CardDescription>
          </CardHeader>
          <CardContent>
            <NdaForm
              nda={nda}
              project={project}
              onSubmit={handleSubmit}
              submitLabel={isNew ? 'Buat NDA' : 'Simpan Perubahan'}
              isSubmitting={createNda.isPending || updateNda.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden print:block">
            <NdaPreview nda={nda} project={project} />
          </div>

          <Tabs defaultValue="edit" className="w-full print:hidden">
            <TabsList className="no-print">
              <TabsTrigger value="edit">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data NDA</CardTitle>
                  <CardDescription>Isi pihak penerima dan konteks kerahasiaan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <NdaForm
                    nda={nda}
                    project={project}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan Perubahan"
                    isSubmitting={updateNda.isPending}
                  />
                </CardContent>
              </Card>

              <SnapshotsPanel type="nda" id={nda.id} entityLabel="NDA" />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="bg-[#dedad2] rounded-lg p-6 md:p-8">
                <NdaPreview nda={nda} project={project} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
