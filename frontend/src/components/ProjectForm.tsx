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
import type { Project, ProjectInput } from '@/types/project'

const projectSchema = z.object({
  name: z.string().min(1, 'Nama project wajib').max(255),
  p1_nama: z.string().max(255).optional().nullable(),
  p1_jabatan: z.string().max(255).optional().nullable(),
  p1_perusahaan: z.string().max(255).optional().nullable(),
  p1_alamat: z.string().max(2000).optional().nullable(),
  p2_nama: z.string().max(255).optional().nullable(),
  p2_jabatan: z.string().max(255).optional().nullable(),
  p2_organisasi: z.string().max(255).optional().nullable(),
  p2_alamat: z.string().max(2000).optional().nullable(),
  nomor_spk: z.string().max(100).optional().nullable(),
  tanggal_spk: z.string().max(100).optional().nullable(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: Project
  onSubmit: (values: ProjectInput) => Promise<void>
  submitLabel?: string
  isSubmitting?: boolean
}

function toFormValues(project?: Project): ProjectFormValues {
  return {
    name: project?.name ?? '',
    p1_nama: project?.p1.nama ?? '',
    p1_jabatan: project?.p1.jabatan ?? '',
    p1_perusahaan: project?.p1.perusahaan ?? '',
    p1_alamat: project?.p1.alamat ?? '',
    p2_nama: project?.p2.nama ?? '',
    p2_jabatan: project?.p2.jabatan ?? '',
    p2_organisasi: project?.p2.organisasi ?? '',
    p2_alamat: project?.p2.alamat ?? '',
    nomor_spk: project?.spk.nomor ?? '',
    tanggal_spk: project?.spk.tanggal ?? '',
  }
}

export function ProjectForm({ project, onSubmit, submitLabel = 'Simpan', isSubmitting }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: toFormValues(project),
    values: toFormValues(project),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nama project */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Project</FormLabel>
              <FormControl>
                <Input placeholder="Pengadaan Mushaf Gelombang 7" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pihak Pertama */}
        <SectionHeader title="Pihak Pertama — Penyedia" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="p1_nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="p1_jabatan"
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
        </div>
        <FormField
          control={form.control}
          name="p1_perusahaan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Perusahaan</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="p1_alamat"
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

        {/* Pihak Kedua */}
        <SectionHeader title="Pihak Kedua — Penerima" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="p2_nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="p2_jabatan"
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
        </div>
        <FormField
          control={form.control}
          name="p2_organisasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Organisasi</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="p2_alamat"
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

        {/* Data SPK */}
        <SectionHeader title="Data SPK" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomor_spk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor SPK</FormLabel>
                <FormControl>
                  <Input placeholder="001/SPK.PROC-.../2025" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tanggal_spk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal SPK</FormLabel>
                <FormControl>
                  <Input placeholder="1 Oktober 2025" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4 border-t flex gap-2 justify-end">
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
    <div className="flex items-center gap-3 pt-2">
      <Separator className="flex-1" />
      <span className="text-[11px] font-bold tracking-wider uppercase text-primary whitespace-nowrap">
        {title}
      </span>
      <Separator className="flex-1" />
    </div>
  )
}
