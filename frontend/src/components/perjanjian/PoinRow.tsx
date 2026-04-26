import { X } from 'lucide-react'
import { toast } from 'sonner'
import { SubPoinRow } from '@/components/perjanjian/SubPoinRow'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useDebouncedText } from '@/hooks/use-debounced-text'
import { useAddSubPoin, useDeletePoin, useUpdatePoin } from '@/hooks/use-perjanjian'
import { extractError } from '@/lib/api'
import type { Poin } from '@/types/perjanjian'

interface Props {
  poin: Poin
  perjanjianId: number
  number: number
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'

export function PoinRow({ poin, perjanjianId, number }: Props) {
  const updatePoin = useUpdatePoin(perjanjianId)
  const deletePoin = useDeletePoin(perjanjianId)
  const addSub = useAddSubPoin(perjanjianId)

  const [value, setValue] = useDebouncedText(poin.text, async (v) => {
    try {
      await updatePoin.mutateAsync({ poinId: poin.id, text: v })
    } catch (err) {
      toast.error(extractError(err))
    }
  })

  async function handleDelete() {
    try {
      await deletePoin.mutateAsync(poin.id)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleAddSub() {
    try {
      await addSub.mutateAsync({ poinId: poin.id, text: '' })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-xs text-muted-foreground font-semibold pt-2 w-5 text-right">
          {number}.
        </span>
        <Textarea
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 text-[12px] min-h-[40px] resize-none"
          placeholder="Isi poin..."
        />
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 px-2 text-[10px] font-semibold"
            onClick={handleAddSub}
          >
            +sub
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {poin.sub.length > 0 && (
        <div className="pl-6 pt-1 border-l-2 border-border ml-2 space-y-1.5">
          {poin.sub.map((sub, idx) => (
            <SubPoinRow
              key={sub.id}
              sub={sub}
              perjanjianId={perjanjianId}
              letter={LETTERS[idx] ?? '?'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
