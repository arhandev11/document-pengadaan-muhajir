import { ArrowLeft, Eye, Loader2, Package, Pencil, Wrench } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PasalList } from '@/components/perjanjian/PasalList'
import { PerjanjianHeaderForm } from '@/components/perjanjian/PerjanjianHeaderForm'
import { DocActionsBar } from '@/components/DocActionsBar'
import { PerjanjianPreview } from '@/components/preview/PerjanjianPreview'
import { SnapshotsPanel } from '@/components/SnapshotsPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { useCreatePerjanjian, usePerjanjian, useUpdatePerjanjian } from '@/hooks/use-perjanjian'
import { useProject } from '@/hooks/use-projects'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { PerjanjianTipe, PerjanjianUpdateInput } from '@/types/perjanjian'

export default function PerjanjianDetailPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data: user } = useCurrentUser()
  const canEdit = hasPermission(user, isNew ? 'perjanjian.create' : 'perjanjian.update')

  const { data: perjanjian, isLoading } = usePerjanjian(id)
  const projectIdForCreate = searchParams.get('project')
  const { data: projectForCreate } = useProject(isNew ? projectIdForCreate ?? undefined : undefined)
  const { data: projectForEdit } = useProject(perjanjian?.project_id)
  const createPerjanjian = useCreatePerjanjian(Number(projectIdForCreate ?? 0))
  const updatePerjanjian = useUpdatePerjanjian(Number(id ?? 0))

  const project = isNew ? projectForCreate : projectForEdit

  async function handleCreate(tipe: PerjanjianTipe) {
    if (!projectIdForCreate) {
      toast.error('Project tidak dipilih.')
      return
    }
    try {
      const created = await createPerjanjian.mutateAsync({
        tipe,
        use_template: true,
      })
      toast.success(`Perjanjian dibuat dengan template ${tipe} — ${created.pasal.length} pasal di-load.`)
      navigate(`/perjanjian/${created.id}`, { replace: true })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleUpdateHeader(values: PerjanjianUpdateInput) {
    try {
      await updatePerjanjian.mutateAsync(values)
      toast.success('Header tersimpan')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  if (isNew && !projectIdForCreate) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="rounded-md bg-destructive/10 text-destructive p-4 text-sm">
          Pilih project dulu sebelum membuat perjanjian.{' '}
          <Link to="/perjanjian" className="underline font-semibold">
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
          Anda tidak memiliki izin untuk {isNew ? 'membuat' : 'mengedit'} perjanjian.
        </div>
      </div>
    )
  }

  if (isNew) {
    return <CreateView project={project} onCreate={handleCreate} isSubmitting={createPerjanjian.isPending} />
  }

  if (!perjanjian) return null

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="mb-6 no-print">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/perjanjian?project=${project?.id ?? ''}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </Button>
        <h1 className="text-2xl font-serif">
          {perjanjian.judul || 'Perjanjian Kerjasama'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project: <strong>{project?.name ?? '—'}</strong>
          {project?.p2.organisasi && <> · untuk {project.p2.organisasi}</>}
          {' · '}
          tipe: <strong className="capitalize">{perjanjian.tipe}</strong>
        </p>
      </div>

      <div className="mb-4 no-print">
        <DocActionsBar
          subjectType="perjanjian"
          subjectId={perjanjian.id}
          data={perjanjian}
          filenamePrefix={`Perjanjian_${perjanjian.nomor || perjanjian.id}`}
        />
      </div>

      <div className="hidden print:block">
        <PerjanjianPreview perjanjian={perjanjian} project={project} />
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
              <CardTitle className="text-base">Informasi Perjanjian</CardTitle>
              <CardDescription>
                Ubah tipe akan reset semua pasal ke template default — ambil snapshot dulu jika perlu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerjanjianHeaderForm
                perjanjian={perjanjian}
                onSubmit={handleUpdateHeader}
                isSubmitting={updatePerjanjian.isPending}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pasal-Pasal</CardTitle>
              <CardDescription>
                Edit inline — perubahan auto-save 800ms setelah berhenti mengetik. Collapse pasal
                untuk fokus ke bagian tertentu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasalList perjanjian={perjanjian} />
            </CardContent>
          </Card>

          <SnapshotsPanel type="perjanjian" id={perjanjian.id} entityLabel="perjanjian" />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="bg-[#dedad2] rounded-lg p-6 md:p-8">
            <PerjanjianPreview perjanjian={perjanjian} project={project} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── Create view ─────────────────────────────────────────────────────────

interface CreateViewProps {
  project: ReturnType<typeof useProject>['data']
  onCreate: (tipe: PerjanjianTipe) => Promise<void>
  isSubmitting?: boolean
}

function CreateView({ project, onCreate, isSubmitting }: CreateViewProps) {
  const [selected, setSelected] = useState<PerjanjianTipe | null>(null)

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/perjanjian?project=${project?.id ?? ''}`}>
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar
          </Link>
        </Button>
        <h1 className="text-2xl font-serif mb-1">Perjanjian Baru</h1>
        <p className="text-sm text-muted-foreground">
          Pilih tipe — template pasal akan otomatis di-apply untuk project <strong>{project?.name}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <TipeCard
          tipe="barang"
          selected={selected === 'barang'}
          icon={<Package className="w-10 h-10 text-primary" />}
          title="Pengadaan Barang"
          description="13 pasal default — mencakup spesifikasi, garansi, pemutusan, keadaan kahar."
          onSelect={() => setSelected('barang')}
        />
        <TipeCard
          tipe="jasa"
          selected={selected === 'jasa'}
          icon={<Wrench className="w-10 h-10 text-primary" />}
          title="Pengadaan Jasa"
          description="12 pasal default — fokus ke lingkup jasa, pelaporan, sub-kontrak."
          onSelect={() => setSelected('jasa')}
        />
      </div>

      <Button
        className="w-full"
        disabled={!selected || isSubmitting}
        onClick={() => selected && onCreate(selected)}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {selected
          ? `Buat Perjanjian ${selected === 'jasa' ? 'Jasa' : 'Barang'} dengan Template`
          : 'Pilih tipe dulu'}
      </Button>
    </div>
  )
}

interface TipeCardProps {
  tipe: PerjanjianTipe
  selected: boolean
  icon: React.ReactNode
  title: string
  description: string
  onSelect: () => void
}

function TipeCard({ selected, icon, title, description, onSelect }: TipeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'text-left p-5 rounded-lg border-2 transition-all',
        selected
          ? 'border-primary bg-secondary/40 shadow-md'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      <div className="mb-3">{icon}</div>
      <div className="font-bold text-base mb-1">{title}</div>
      <div className="text-xs text-muted-foreground leading-relaxed">{description}</div>
    </button>
  )
}
