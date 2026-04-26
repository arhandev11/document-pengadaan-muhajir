import { ArrowLeft, Eye, Loader2, Pencil } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { BeritaHeaderForm } from '@/components/BeritaHeaderForm'
import { BeritaItemsManager } from '@/components/BeritaItemsManager'
import { DocActionsBar } from '@/components/DocActionsBar'
import { BeritaPreview } from '@/components/preview/BeritaPreview'
import { SnapshotsPanel } from '@/components/SnapshotsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useBerita, useCreateBerita, useUpdateBerita } from '@/hooks/use-berita'
import { useProject } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import type { BeritaHeaderInput } from '@/types/berita'

export default function BeritaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canEdit = hasPermission(user, isNew ? 'berita.create' : 'berita.update')

  const { data: berita, isLoading } = useBerita(id)
  const projectIdForCreate = searchParams.get('project')
  const { data: projectForCreate } = useProject(isNew ? projectIdForCreate ?? undefined : undefined)
  const { data: projectForEdit } = useProject(berita?.project_id)

  const createBerita = useCreateBerita(Number(projectIdForCreate ?? 0))
  const updateBerita = useUpdateBerita(Number(id ?? 0))

  const project = isNew ? projectForCreate : projectForEdit

  async function handleSubmit(values: BeritaHeaderInput) {
    try {
      if (isNew) {
        if (!projectIdForCreate) {
          toast.error('Project tidak dipilih.')
          return
        }
        const created = await createBerita.mutateAsync({ ...values, items: [] })
        toast.success('Berita dibuat — sekarang tambahkan item.')
        navigate(`/berita/${created.id}`, { replace: true })
      } else {
        await updateBerita.mutateAsync(values)
        toast.success('Header berita tersimpan')
      }
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  if (isNew && !projectIdForCreate) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-md bg-destructive/10 text-destructive p-4 text-sm">
          Pilih project dulu sebelum membuat berita acara.{' '}
          <Link to="/berita" className="underline font-semibold">
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
          Anda tidak memiliki izin untuk {isNew ? 'membuat' : 'mengedit'} berita acara.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6 no-print">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/berita?project=${project?.id ?? ''}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </Button>
        <h1 className="text-2xl font-serif">
          {isNew ? 'Berita Acara Baru' : (berita?.nomor || 'Berita Acara')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project: <strong>{project?.name ?? '—'}</strong>
          {project?.p2.organisasi && <> · penerima {project.p2.organisasi}</>}
        </p>
      </div>

      {!isNew && berita && (
        <div className="mb-4 no-print">
          <DocActionsBar
            subjectType="berita"
            subjectId={berita.id}
            data={berita}
            filenamePrefix={`Berita_Acara_${berita.nomor || berita.id}`}
          />
        </div>
      )}

      {isNew || !berita ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Berita</CardTitle>
            <CardDescription>Identitas dokumen dan detail penandatanganan.</CardDescription>
          </CardHeader>
          <CardContent>
            <BeritaHeaderForm
              berita={berita}
              onSubmit={handleSubmit}
              submitLabel={isNew ? 'Buat & Lanjut Tambah Item' : 'Simpan Header'}
              isSubmitting={createBerita.isPending || updateBerita.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden print:block">
            <BeritaPreview berita={berita} project={project} />
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
                  <CardTitle className="text-base">Informasi Berita</CardTitle>
                  <CardDescription>Identitas dokumen dan detail penandatanganan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <BeritaHeaderForm
                    berita={berita}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan Header"
                    isSubmitting={updateBerita.isPending}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daftar Barang Serah Terima</CardTitle>
                  <CardDescription>
                    Edit inline — perubahan auto-save 800ms setelah berhenti mengetik.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BeritaItemsManager berita={berita} />
                </CardContent>
              </Card>

              <SnapshotsPanel type="berita" id={berita.id} entityLabel="berita acara" />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="bg-[#dedad2] rounded-lg p-6 md:p-8">
                <BeritaPreview berita={berita} project={project} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
