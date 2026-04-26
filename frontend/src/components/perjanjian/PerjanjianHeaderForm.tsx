import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Package, Wrench } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useResetPerjanjianTemplate } from '@/hooks/use-perjanjian'
import { extractError } from '@/lib/api'
import { cn } from '@/lib/utils'
import type { Perjanjian, PerjanjianTipe, PerjanjianUpdateInput } from '@/types/perjanjian'

const schema = z.object({
  judul: z.string().max(255).optional().nullable(),
  nomor: z.string().max(100).optional().nullable(),
  tanggal: z.string().max(100).optional().nullable(),
  tempat: z.string().max(100).optional().nullable(),
  hari_ttd: z.string().max(30).optional().nullable(),
  konsideran: z.string().max(5000).optional().nullable(),
})

type Values = z.infer<typeof schema>

interface Props {
  perjanjian: Perjanjian
  onSubmit: (values: PerjanjianUpdateInput) => Promise<void>
  isSubmitting?: boolean
}

function toDefaults(p: Perjanjian): Values {
  return {
    judul: p.judul ?? '',
    nomor: p.nomor ?? '',
    tanggal: p.tanggal ?? '',
    tempat: p.tempat ?? '',
    hari_ttd: p.hari_ttd ?? '',
    konsideran: p.konsideran ?? '',
  }
}

export function PerjanjianHeaderForm({ perjanjian, onSubmit, isSubmitting }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(perjanjian),
    values: toDefaults(perjanjian),
  })

  const resetTemplate = useResetPerjanjianTemplate(perjanjian.id)

  async function handleResetTo(tipe: PerjanjianTipe) {
    if (tipe === perjanjian.tipe && perjanjian.pasal.length > 0) {
      // Reset ke tipe yang sama = refresh template
    }
    try {
      await resetTemplate.mutateAsync(tipe)
      toast.success(`Template ${tipe === 'jasa' ? 'Jasa' : 'Barang'} di-apply — semua pasal lama dihapus.`)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <SectionHeader title="Jenis Perjanjian" />
        <div className="grid grid-cols-2 gap-3">
          <TipeToggle
            active={perjanjian.tipe === 'barang'}
            tipe="barang"
            icon={<Package className="w-4 h-4" />}
            label="Pengadaan Barang"
            onSelect={handleResetTo}
            currentTipe={perjanjian.tipe}
            hasPasal={perjanjian.pasal.length > 0}
          />
          <TipeToggle
            active={perjanjian.tipe === 'jasa'}
            tipe="jasa"
            icon={<Wrench className="w-4 h-4" />}
            label="Pengadaan Jasa"
            onSelect={handleResetTo}
            currentTipe={perjanjian.tipe}
            hasPasal={perjanjian.pasal.length > 0}
          />
        </div>

        <SectionHeader title="Identitas Dokumen" />
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Perjanjian</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor</FormLabel>
                <FormControl>
                  <Input placeholder="PKS-001/..." {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tempat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Penandatanganan</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hari_ttd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hari</FormLabel>
                <FormControl>
                  <Input placeholder="Senin" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="konsideran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konsideran / Menimbang</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Latar belakang / tujuan perjanjian..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Simpan Header
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface TipeToggleProps {
  active: boolean
  tipe: PerjanjianTipe
  icon: React.ReactNode
  label: string
  onSelect: (tipe: PerjanjianTipe) => void
  currentTipe: PerjanjianTipe
  hasPasal: boolean
}

function TipeToggle({ active, tipe, icon, label, onSelect, currentTipe, hasPasal }: TipeToggleProps) {
  const needsConfirm = hasPasal && tipe !== currentTipe

  const buttonContent = (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center gap-2 p-3 rounded-md border-2 font-bold text-xs transition-colors',
        active
          ? 'border-primary bg-secondary text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40',
      )}
    >
      {icon}
      {label}
    </button>
  )

  if (!needsConfirm) {
    return (
      <div onClick={() => !active && onSelect(tipe)}>
        {buttonContent}
      </div>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {buttonContent}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ganti ke template {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Semua pasal saat ini (beserta poin & sub-poin) akan di-<strong>hapus</strong>
            dan diganti dengan template default {label}. Tindakan ini tidak dapat dibatalkan
            — ambil snapshot dulu kalau perlu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={() => onSelect(tipe)}>
            Ya, ganti template
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-[11px] font-bold tracking-wider uppercase text-primary whitespace-nowrap">
        {title}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}
