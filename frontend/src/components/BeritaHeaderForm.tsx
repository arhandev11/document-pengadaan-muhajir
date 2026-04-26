import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import { todayDayName, todayId } from '@/lib/date'
import type { Berita, BeritaHeaderInput } from '@/types/berita'

const schema = z.object({
  nomor: z.string().max(100).optional().nullable(),
  hari: z.string().max(30).optional().nullable(),
  tanggal: z.string().max(100).optional().nullable(),
  tempat: z.string().max(100).optional().nullable(),
  nama_kegiatan: z.string().max(5000).optional().nullable(),
  tempat_buat: z.string().max(100).optional().nullable(),
  tanggal_buat: z.string().max(100).optional().nullable(),
})

type Values = z.infer<typeof schema>

interface Props {
  berita?: Berita
  onSubmit: (values: BeritaHeaderInput) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

function toDefaults(b?: Berita): Values {
  // Untuk dokumen baru, isi default tanggal/hari hari ini (closes PRD §15.24).
  // Untuk dokumen existing, pertahankan nilai saat ini (boleh kosong).
  const isNew = !b
  return {
    nomor: b?.nomor ?? '',
    hari: b?.hari ?? (isNew ? todayDayName() : ''),
    tanggal: b?.tanggal ?? (isNew ? todayId() : ''),
    tempat: b?.tempat ?? '',
    nama_kegiatan: b?.nama_kegiatan ?? '',
    tempat_buat: b?.tempat_buat ?? '',
    tanggal_buat: b?.tanggal_buat ?? (isNew ? todayId() : ''),
  }
}

export function BeritaHeaderForm({ berita, onSubmit, submitLabel = 'Simpan', isSubmitting }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(berita),
    values: toDefaults(berita),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <SectionHeader title="Identitas Dokumen" />
        <FormField
          control={form.control}
          name="nomor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Berita Acara</FormLabel>
              <FormControl>
                <Input placeholder="BA-001/..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hari"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hari</FormLabel>
                <FormControl>
                  <Input placeholder="Kamis" {...field} value={field.value ?? ''} />
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
                  <Input placeholder="15 Desember 2025" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tempat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat</FormLabel>
              <FormControl>
                <Input placeholder="Jakarta Selatan" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nama_kegiatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SectionHeader title="Penandatanganan" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tempat_buat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat Pembuatan</FormLabel>
                <FormControl>
                  <Input placeholder="Jakarta" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal_buat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Pembuatan</FormLabel>
                <FormControl>
                  <Input placeholder="15 Desember 2025" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
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
