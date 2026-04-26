import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLink, Loader2, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
import type { Nda, NdaInput } from '@/types/nda'
import type { Project } from '@/types/project'

const schema = z.object({
  nomor: z.string().max(100).optional().nullable(),
  hari: z.string().max(30).optional().nullable(),
  tanggal: z.string().max(100).optional().nullable(),
  tempat: z.string().max(100).optional().nullable(),
  pn_nama: z.string().max(255).optional().nullable(),
  pn_ktp: z
    .string()
    .max(30)
    .refine(
      (v) => !v || /^\d{16}$/.test(v.replace(/\s/g, '')),
      'KTP harus 16 digit angka',
    )
    .optional()
    .nullable(),
  pn_alamat: z.string().max(2000).optional().nullable(),
  pn_jabatan: z.string().max(255).optional().nullable(),
  pn_organisasi: z.string().max(255).optional().nullable(),
  pn_nomor_kontrak: z.string().max(100).optional().nullable(),
  pn_tanggal_kontrak: z.string().max(100).optional().nullable(),
  konteks_pelaksanaan: z.string().max(5000).optional().nullable(),
  jenis_dukungan: z.string().max(5000).optional().nullable(),
  objek_kegiatan: z.string().max(5000).optional().nullable(),
  objek_informasi: z.string().max(5000).optional().nullable(),
  jangka_waktu: z.string().max(100).optional().nullable(),
})

type Values = z.infer<typeof schema>

interface Props {
  nda?: Nda
  project?: Project
  onSubmit: (values: NdaInput) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

function toDefaults(n?: Nda): Values {
  const isNew = !n
  return {
    nomor: n?.nomor ?? '',
    hari: n?.hari ?? (isNew ? todayDayName() : 'Senin'),
    tanggal: n?.tanggal ?? (isNew ? todayId() : ''),
    tempat: n?.tempat ?? 'Jakarta',
    pn_nama: n?.pihak_penerima.nama ?? '',
    pn_ktp: n?.pihak_penerima.ktp ?? '',
    pn_alamat: n?.pihak_penerima.alamat ?? '',
    pn_jabatan: n?.pihak_penerima.jabatan ?? '',
    pn_organisasi: n?.pihak_penerima.organisasi ?? '',
    pn_nomor_kontrak: n?.pihak_penerima.nomor_kontrak ?? '',
    pn_tanggal_kontrak: n?.pihak_penerima.tanggal_kontrak ?? '',
    konteks_pelaksanaan: n?.konteks_pelaksanaan ?? '',
    jenis_dukungan: n?.jenis_dukungan ?? '',
    objek_kegiatan: n?.objek_kegiatan ?? '',
    objek_informasi: n?.objek_informasi ?? '',
    jangka_waktu: n?.jangka_waktu ?? '2 (dua) tahun',
  }
}

export function NdaForm({ nda, project, onSubmit, submitLabel = 'Simpan', isSubmitting }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: toDefaults(nda),
    values: toDefaults(nda),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Dasar hukum banner */}
        <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100 text-xs p-3 flex items-start gap-2">
          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <div>
              <strong>Dasar Hukum:</strong> UU No. 30 Tahun 2000 (Rahasia Dagang) · Pasal 1320 KUHPerdata
            </div>
            <div>Pihak Pengungkap otomatis dari Setup Proyek (Pihak Pertama).</div>
          </div>
        </div>

        <SectionHeader title="Identitas Dokumen" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor NDA</FormLabel>
                <FormControl>
                  <Input placeholder="NDA-001/..." {...field} value={field.value ?? ''} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hari"
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
          <FormField
            control={form.control}
            name="tempat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempat</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pihak Penerima */}
        <SectionHeader title="Pihak Penerima (Receiving Party)" />
        <FormField
          control={form.control}
          name="pn_nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Nama perorangan / perwakilan" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pn_ktp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. KTP</FormLabel>
              <FormControl>
                <Input placeholder="Nomor KTP" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pn_alamat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pn_jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pn_organisasi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organisasi / Perusahaan</FormLabel>
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
            name="pn_nomor_kontrak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Kontrak / SPK</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pn_tanggal_kontrak"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Kontrak / SPK</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pihak Pengungkap (read-only) */}
        <SectionHeader title="Pihak Pengungkap (Disclosing Party)" />
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm space-y-1">
          {project?.p1.nama ? (
            <>
              <div>
                <strong>{project.p1.nama}</strong> · {project.p1.jabatan}
              </div>
              <div>{project.p1.perusahaan}</div>
              <div className="text-muted-foreground text-xs">{project.p1.alamat}</div>
            </>
          ) : (
            <div className="text-muted-foreground italic">
              Data Pihak Pertama project belum diisi.
            </div>
          )}
          <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
            <Link to={`/projects/${project?.id ?? ''}`}>
              Ubah di Setup Proyek
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </Link>
          </Button>
        </div>

        {/* Konteks & Isi */}
        <SectionHeader title="Konteks & Isi NDA" />
        <FormField
          control={form.control}
          name="konteks_pelaksanaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konteks Pelaksanaan</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Contoh: penyusunan sistem informasi manajemen..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jenis_dukungan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Dukungan / Kerjasama</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Contoh: konsultasi teknis dan pendampingan..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="objek_kegiatan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objek / Ruang Lingkup Kegiatan</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Contoh: pengelolaan aset dan keuangan..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="objek_informasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objek Informasi Rahasia</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  placeholder="Contoh: data keuangan, struktur organisasi, sistem IT..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jangka_waktu"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jangka Waktu Kerahasiaan</FormLabel>
              <FormControl>
                <Input placeholder="2 (dua) tahun" {...field} value={field.value ?? ''} />
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

        <p className="text-[10.5px] text-muted-foreground text-center leading-relaxed pt-2 border-t">
          Dokumen ini dilindungi oleh UU No. 30 Tahun 2000 tentang Rahasia Dagang.<br />
          Pelanggaran dapat dikenakan sanksi pidana sesuai Pasal 17 ayat (1).
        </p>
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
