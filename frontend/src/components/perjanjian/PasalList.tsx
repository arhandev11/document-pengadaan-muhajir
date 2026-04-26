import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PasalCard } from '@/components/perjanjian/PasalCard'
import { Button } from '@/components/ui/button'
import { useAddPasal, useReorderPasal } from '@/hooks/use-perjanjian'
import { extractError } from '@/lib/api'
import type { Perjanjian } from '@/types/perjanjian'

interface Props {
  perjanjian: Perjanjian
}

export function PasalList({ perjanjian }: Props) {
  const addPasal = useAddPasal(perjanjian.id)
  const reorder = useReorderPasal(perjanjian.id)

  async function handleAdd() {
    try {
      await addPasal.mutateAsync({ judul: 'Pasal Baru', intro: '' })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const ids = perjanjian.pasal.map((p) => p.id)
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
      {perjanjian.pasal.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8 rounded-md bg-muted/30 border border-dashed">
          Belum ada pasal. Gunakan "Reset Template" atau tambah pasal manual.
        </div>
      )}

      {perjanjian.pasal.map((pasal, idx) => (
        <PasalCard
          key={pasal.id}
          pasal={pasal}
          perjanjianId={perjanjian.id}
          number={idx + 1}
          totalPasal={perjanjian.pasal.length}
          onMove={(dir) => handleMove(idx, dir)}
        />
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={handleAdd}
        disabled={addPasal.isPending}
      >
        <Plus className="w-4 h-4" />
        Tambah Pasal
      </Button>

      <div className="text-xs text-muted-foreground text-center pt-2">
        {perjanjian.pasal.length} pasal · {perjanjian.pasal.reduce((s, p) => s + p.poin.length, 0)} poin
      </div>
    </div>
  )
}
