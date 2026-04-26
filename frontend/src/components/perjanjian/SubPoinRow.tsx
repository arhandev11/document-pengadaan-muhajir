import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedText } from '@/hooks/use-debounced-text'
import { useDeleteSubPoin, useUpdateSubPoin } from '@/hooks/use-perjanjian'
import { extractError } from '@/lib/api'
import type { SubPoin } from '@/types/perjanjian'

interface Props {
  sub: SubPoin
  perjanjianId: number
  letter: string // 'a', 'b', 'c'
}

export function SubPoinRow({ sub, perjanjianId, letter }: Props) {
  const updateSub = useUpdateSubPoin(perjanjianId)
  const deleteSub = useDeleteSubPoin(perjanjianId)

  const [value, setValue] = useDebouncedText(sub.text, async (v) => {
    try {
      await updateSub.mutateAsync({ subId: sub.id, text: v })
    } catch (err) {
      toast.error(extractError(err))
    }
  })

  async function handleDelete() {
    try {
      await deleteSub.mutateAsync(sub.id)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground font-semibold w-5 text-right">{letter}.</span>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 text-[12px] h-8"
        placeholder="Sub-poin..."
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        onClick={handleDelete}
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}
