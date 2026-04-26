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
import { todayId } from '@/lib/date'
import type { Surat, SuratHeaderInput } from '@/types/surat'

const schema = z.object({
  nomor: z.string().max(100).optional().nullable(),
  tanggal: z.string().max(100).optional().nullable(),
  perihal: z.string().max(500).optional().nullable(),
  nama_program: z.string().max(5000).optional().nullable(),
  garansi: z.string().max(255).optional().nullable(),
  waktu_kirim: z.string().max(255).optional().nullable(),
  masa_berlaku: z.string().max(255).optional().nullable(),
})

export type SuratFormValues = z.infer<typeof schema>

interface Props {
  surat?: Surat
  onSubmit: (values: SuratHeaderInput) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

function toDefaults(surat?: Surat): SuratFormValues {
  return {
    nomor: surat?.nomor ?? '',
    tanggal: surat?.tanggal ?? (surat ? '' : todayId()),
    perihal: surat?.perihal ?? '',
    nama_program: surat?.nama_program ?? '',
    garansi: surat?.garansi ?? '',
    waktu_kirim: surat?.waktu_kirim ?? '',
    masa_berlaku: surat?.masa_berlaku ?? '',
  }
}

export function SuratHeaderForm({ surat, onSubmit, submitLabel = 'Simpan', isSubmitting }: Props) {
  const form = useForm<SuratFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(surat),
    values: toDefaults(surat),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <SectionHeader title="Identitas Surat" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Surat</FormLabel>
                <FormControl>
                  <Input placeholder="SP-001/KIE/..." {...field} value={field.value ?? ''} />
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
                  <Input placeholder="22 April 2026" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="perihal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perihal</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nama_program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan / Program</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SectionHeader title="Keterangan" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="garansi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Garansi</FormLabel>
                <FormControl>
                  <Input placeholder="1 tahun" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waktu_kirim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu Pengiriman</FormLabel>
                <FormControl>
                  <Input placeholder="maksimal 7 hari kerja" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="masa_berlaku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Masa Berlaku Penawaran</FormLabel>
              <FormControl>
                <Input placeholder="30 hari kalender" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
