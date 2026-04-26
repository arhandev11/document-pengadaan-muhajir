import { ArrowLeft, Eye, Loader2, Pencil } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { DocActionsBar } from '@/components/DocActionsBar'
import { SuratPreview } from '@/components/preview/SuratPreview'
import { SnapshotsPanel } from '@/components/SnapshotsPanel'
import { SuratHeaderForm } from '@/components/SuratHeaderForm'
import { SuratItemsManager } from '@/components/SuratItemsManager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useProject } from '@/hooks/use-projects'
import { useCreateSurat, useSurat, useUpdateSurat } from '@/hooks/use-surat'
import { extractError } from '@/lib/api'
import type { SuratHeaderInput } from '@/types/surat'

export default function SuratDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canEdit = hasPermission(user, isNew ? 'surat.create' : 'surat.update')

  const { data: surat, isLoading } = useSurat(id)
  const projectIdForCreate = searchParams.get('project')
  const { data: projectForCreate } = useProject(
    isNew ? projectIdForCreate ?? undefined : undefined,
  )
  const { data: projectForEdit } = useProject(surat?.project_id)

  const createSurat = useCreateSurat(Number(projectIdForCreate ?? 0))
  const updateSurat = useUpdateSurat(Number(id ?? 0))

  const project = isNew ? projectForCreate : projectForEdit

  async function handleSubmit(values: SuratHeaderInput) {
    try {
      if (isNew) {
        if (!projectIdForCreate) {
          toast.error('Project tidak dipilih.')
          return
        }
        const created = await createSurat.mutateAsync({ ...values, items: [] })
        toast.success('Surat dibuat — sekarang tambahkan item.')
        navigate(`/surat/${created.id}`, { replace: true })
      } else {
        await updateSurat.mutateAsync(values)
        toast.success('Header surat tersimpan')
      }
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  if (isNew && !projectIdForCreate) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-md bg-destructive/10 text-destructive p-4 text-sm">
          Pilih project dulu sebelum membuat surat.{' '}
          <Link to="/surat" className="underline font-semibold">
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
          Anda tidak memiliki izin untuk {isNew ? 'membuat' : 'mengedit'} surat.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6 no-print">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/surat?project=${project?.id ?? ''}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </Button>
        <h1 className="text-2xl font-serif">
          {isNew ? 'Surat Penawaran Baru' : (surat?.nomor || 'Surat Penawaran')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project: <strong>{project?.name ?? '—'}</strong>
          {project?.p2.organisasi && <> · untuk {project.p2.organisasi}</>}
        </p>
      </div>

      {!isNew && surat && (
        <div className="mb-4 no-print">
          <DocActionsBar
            subjectType="surat"
            subjectId={surat.id}
            data={surat}
            filenamePrefix={`Surat_Penawaran_${surat.nomor || surat.id}`}
          />
        </div>
      )}

      {isNew || !surat ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Surat</CardTitle>
            <CardDescription>Nomor, tanggal, dan keterangan penawaran.</CardDescription>
          </CardHeader>
          <CardContent>
            <SuratHeaderForm
              surat={surat}
              onSubmit={handleSubmit}
              submitLabel={isNew ? 'Buat & Lanjut Tambah Item' : 'Simpan Header'}
              isSubmitting={createSurat.isPending || updateSurat.isPending}
            />
          </CardContent>
        </Card>
      ) : (
        <>
        {/* Print-only preview: selalu di DOM tapi visible hanya saat print */}
        <div className="hidden print:block">
          <SuratPreview surat={surat} project={project} />
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
                <CardTitle className="text-base">Informasi Surat</CardTitle>
                <CardDescription>Nomor, tanggal, dan keterangan penawaran.</CardDescription>
              </CardHeader>
              <CardContent>
                <SuratHeaderForm
                  surat={surat}
                  onSubmit={handleSubmit}
                  submitLabel="Simpan Header"
                  isSubmitting={updateSurat.isPending}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daftar Barang</CardTitle>
                <CardDescription>
                  Edit inline — perubahan auto-save 800ms setelah berhenti mengetik.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SuratItemsManager surat={surat} />
              </CardContent>
            </Card>

            <SnapshotsPanel type="surat" id={surat.id} entityLabel="surat penawaran" />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <div className="bg-[#dedad2] rounded-lg p-6 md:p-8">
              <SuratPreview surat={surat} project={project} />
            </div>
          </TabsContent>
        </Tabs>
        </>
      )}
    </div>
  )
}
