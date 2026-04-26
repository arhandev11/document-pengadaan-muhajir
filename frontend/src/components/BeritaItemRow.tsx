import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteBeritaItem, useUpdateBeritaItem } from '@/hooks/use-berita'
import { extractError } from '@/lib/api'
import type { BeritaItem } from '@/types/berita'

interface Props {
  item: BeritaItem
  beritaId: number
  index: number
  totalItems: number
  onMove: (direction: 'up' | 'down') => void
}

export function BeritaItemRow({ item, beritaId, index, totalItems, onMove }: Props) {
  const [local, setLocal] = useState({
    nama: item.nama ?? '',
    jumlah: item.jumlah ?? '',
    spesifikasi: item.spesifikasi ?? '',
    kondisi: item.kondisi ?? '',
  })
  const updateItem = useUpdateBeritaItem(beritaId)
  const deleteItem = useDeleteBeritaItem(beritaId)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    setLocal({
      nama: item.nama ?? '',
      jumlah: item.jumlah ?? '',
      spesifikasi: item.spesifikasi ?? '',
      kondisi: item.kondisi ?? '',
    })
  }, [item.id, item.nama, item.jumlah, item.spesifikasi, item.kondisi])

  function scheduleSave(field: keyof typeof local, value: string) {
    setLocal((prev) => ({ ...prev, [field]: value }))
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        await updateItem.mutateAsync({
          itemId: item.id,
          payload: { ...local, [field]: value },
        })
      } catch (err) {
        toast.error(extractError(err))
      }
    }, 800)
  }

  async function handleDelete() {
    if (totalItems <= 1) {
      toast.error('Minimal harus ada 1 item.')
      return
    }
    try {
      await deleteItem.mutateAsync(item.id)
      toast.success('Item dihapus')
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-bold tracking-wider uppercase text-primary">
          Item {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            disabled={index === 0}
            onClick={() => onMove('up')}
            aria-label="Pindah item ke atas"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            disabled={index === totalItems - 1}
            onClick={() => onMove('down')}
            aria-label="Pindah item ke bawah"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            disabled={totalItems <= 1}
            onClick={handleDelete}
            aria-label="Hapus item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Field label="Nama Barang">
        <Input value={local.nama} onChange={(e) => scheduleSave('nama', e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Jumlah">
          <Input
            value={local.jumlah}
            onChange={(e) => scheduleSave('jumlah', e.target.value)}
            placeholder="20.000 eks"
          />
        </Field>
        <Field label="Spesifikasi">
          <Input
            value={local.spesifikasi}
            onChange={(e) => scheduleSave('spesifikasi', e.target.value)}
            placeholder="Sesuai"
          />
        </Field>
      </div>
      <Field label="Kondisi">
        <Input
          value={local.kondisi}
          onChange={(e) => scheduleSave('kondisi', e.target.value)}
          placeholder="Baik"
        />
      </Field>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}
