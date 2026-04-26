import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PoinRow } from '@/components/perjanjian/PoinRow'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDebouncedText } from '@/hooks/use-debounced-text'
import { useAddPoin, useDeletePasal, useUpdatePasal } from '@/hooks/use-perjanjian'
import { extractError } from '@/lib/api'
import type { Pasal } from '@/types/perjanjian'

interface Props {
  pasal: Pasal
  perjanjianId: number
  number: number
  totalPasal: number
  onMove: (direction: 'up' | 'down') => void
}

export function PasalCard({ pasal, perjanjianId, number, totalPasal, onMove }: Props) {
  const [open, setOpen] = useState(true)
  const updatePasal = useUpdatePasal(perjanjianId)
  const deletePasal = useDeletePasal(perjanjianId)
  const addPoin = useAddPoin(perjanjianId)

  const [judul, setJudul] = useDebouncedText(pasal.judul, async (v) => {
    try {
      await updatePasal.mutateAsync({ pasalId: pasal.id, payload: { judul: v } })
    } catch (err) {
      toast.error(extractError(err))
    }
  })

  const [intro, setIntro] = useDebouncedText(pasal.intro, async (v) => {
    try {
      await updatePasal.mutateAsync({ pasalId: pasal.id, payload: { intro: v } })
    } catch (err) {
      toast.error(extractError(err))
    }
  })

  async function handleDelete() {
    try {
      await deletePasal.mutateAsync(pasal.id)
      toast.success(`Pasal ${number} dihapus`)
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  async function handleAddPoin() {
    try {
      await addPoin.mutateAsync({ pasalId: pasal.id, text: '' })
    } catch (err) {
      toast.error(extractError(err))
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header — clickable to collapse */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-secondary/60 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-[11px] font-extrabold text-primary-foreground flex-shrink-0">
          {number}
        </div>
        <Input
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Judul Pasal..."
          className="flex-1 font-bold bg-transparent border-transparent focus-visible:bg-card focus-visible:border-input"
        />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={number === 1}
          onClick={() => onMove('up')}
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          disabled={number === totalPasal}
          onClick={() => onMove('down')}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs">
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pasal {number}?</AlertDialogTitle>
              <AlertDialogDescription>
                Pasal <strong>{pasal.judul}</strong> beserta {pasal.poin.length} poin
                dan semua sub-poin akan dihapus permanent.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Body */}
      {open && (
        <div className="p-3 space-y-3">
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Kalimat Pembuka (opsional)
            </Label>
            <Textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Contoh: PIHAK KEDUA berkewajiban untuk:"
              className="text-[12.5px] resize-none"
            />
          </div>

          <div>
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
              Butir-Butir Poin
            </Label>
            <div className="space-y-2">
              {pasal.poin.length === 0 && (
                <div className="text-xs text-muted-foreground italic text-center py-3">
                  Belum ada poin — klik tombol di bawah untuk menambah.
                </div>
              )}
              {pasal.poin.map((poin, idx) => (
                <PoinRow
                  key={poin.id}
                  poin={poin}
                  perjanjianId={perjanjianId}
                  number={idx + 1}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 border-dashed text-xs"
              onClick={handleAddPoin}
              disabled={addPoin.isPending}
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Poin
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
