import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { BeritaItemRow } from '@/components/BeritaItemRow'
import { Button } from '@/components/ui/button'
import { useAddBeritaItem, useReorderBeritaItems } from '@/hooks/use-berita'
import { extractError } from '@/lib/api'
import type { Berita } from '@/types/berita'

interface Props {
  berita: Berita
}

export function BeritaItemsManager({ berita }: Props) {
  const addItem = useAddBeritaItem(berita.id)
  const reorder = useReorderBeritaItems(berita.id)

  async function handleAdd() {
    try {
      await addItem.mutateAsync({
        nama: '',
        jumlah: '',
        spesifikasi: 'Sesuai',
        kondisi: 'Baik',
      })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const ids = berita.items.map((it) => it.id)
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    try {
      await reorder.mutateAsync(ids)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="space-y-3">
      {berita.items.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8 rounded-md bg-muted/30 border border-dashed">
          Belum ada item. Klik tombol di bawah untuk menambah.
        </div>
      )}

      {berita.items.map((item, idx) => (
        <BeritaItemRow
          key={item.id}
          item={item}
          beritaId={berita.id}
          index={idx}
          totalItems={berita.items.length}
          onMove={(dir) => handleMove(idx, dir)}
        />
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={handleAdd}
        disabled={addItem.isPending}
      >
        <Plus className="w-4 h-4" />
        Tambah Item
      </Button>
    </div>
  )
}
