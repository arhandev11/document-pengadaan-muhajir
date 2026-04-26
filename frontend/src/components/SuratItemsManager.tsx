import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { SuratItemRow } from '@/components/SuratItemRow'
import { Button } from '@/components/ui/button'
import { useAddSuratItem, useReorderSuratItems } from '@/hooks/use-surat'
import { extractError } from '@/lib/api'
import { toRp } from '@/lib/currency'
import type { Surat } from '@/types/surat'

interface Props {
  surat: Surat
}

export function SuratItemsManager({ surat }: Props) {
  const addItem = useAddSuratItem(surat.id)
  const reorder = useReorderSuratItems(surat.id)

  async function handleAdd() {
    try {
      await addItem.mutateAsync({
        nama: '',
        spesifikasi: '',
        jumlah: '',
        harga_satuan: '',
      })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const ids = surat.items.map((it) => it.id)
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
      {surat.items.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8 rounded-md bg-muted/30 border border-dashed">
          Belum ada item. Klik tombol di bawah untuk menambah.
        </div>
      )}

      {surat.items.map((item, idx) => (
        <SuratItemRow
          key={item.id}
          item={item}
          suratId={surat.id}
          index={idx}
          totalItems={surat.items.length}
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

      {surat.items.length > 0 && (
        <div className="pt-3 border-t mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Penawaran</span>
            <span className="text-lg font-serif font-semibold text-primary">
              Rp {toRp(surat.grand_total ?? 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
