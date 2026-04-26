import { Copy, Download, FileJson, Printer } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { hasPermission, useCurrentUser } from '@/hooks/use-auth'
import { type EventSubjectType, useLogEvent } from '@/hooks/use-events'
import { extractError } from '@/lib/api'

interface Props {
  subjectType: EventSubjectType
  subjectId: number
  /** Data dokumen untuk di-export sebagai JSON */
  data: unknown
  /** Filename prefix saat download (tanpa extension) */
  filenamePrefix: string
}

/**
 * Bar reusable untuk aksi dokumen: Print, Save HTML, Save JSON, Copy JSON.
 * Backend D4 = client-side file generation; backend hanya log event.
 */
export function DocActionsBar({ subjectType, subjectId, data, filenamePrefix }: Props) {
  const { data: user } = useCurrentUser()
  const canExportPdf = hasPermission(user, 'export.pdf')
  const canExportHtml = hasPermission(user, 'export.html')
  const canExportJson = hasPermission(user, 'export.json')

  const logEvent = useLogEvent()

  async function reportEvent(action: 'PRINT' | 'EXPORT_PDF' | 'EXPORT_HTML' | 'EXPORT_JSON') {
    try {
      await logEvent.mutateAsync({ action, subject_type: subjectType, subject_id: subjectId })
    } catch (err) {
      // Soft fail — file action tetap jalan, log saja yang gagal
      console.error('Event log failed:', extractError(err))
    }
  }

  function handlePrint() {
    reportEvent('PRINT')
    setTimeout(() => window.print(), 100)
  }

  function handleSavePDF() {
    reportEvent('EXPORT_PDF')
    setTimeout(() => window.print(), 100)
  }

  function handleSaveHTML() {
    reportEvent('EXPORT_HTML')
    const html = document.documentElement.outerHTML
    const blob = new Blob([html], { type: 'text/html' })
    triggerDownload(blob, `${filenamePrefix}.html`)
    toast.success('File HTML diunduh')
  }

  function handleSaveJSON() {
    reportEvent('EXPORT_JSON')
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    triggerDownload(blob, `${filenamePrefix}.json`)
    toast.success('File JSON diunduh')
  }

  async function handleCopyJSON() {
    const json = JSON.stringify(data, null, 2)
    try {
      await navigator.clipboard.writeText(json)
      toast.success('JSON disalin ke clipboard')
    } catch {
      toast.error('Browser tidak support clipboard. Gunakan "Save JSON" instead.')
    }
  }

  return (
    <Card className="p-2 flex items-center gap-2 flex-wrap no-print sticky top-0 z-10 bg-card/95 backdrop-blur">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2">
        Aksi
      </span>

      {canExportPdf && (
        <Button size="sm" variant="outline" onClick={handleSavePDF}>
          <Download className="w-3.5 h-3.5" />
          Simpan PDF
        </Button>
      )}
      {canExportHtml && (
        <Button size="sm" variant="outline" onClick={handleSaveHTML}>
          <Download className="w-3.5 h-3.5" />
          Simpan HTML
        </Button>
      )}
      {canExportJson && (
        <>
          <Button size="sm" variant="outline" onClick={handleSaveJSON}>
            <FileJson className="w-3.5 h-3.5" />
            Simpan JSON
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCopyJSON}>
            <Copy className="w-3.5 h-3.5" />
            Copy JSON
          </Button>
        </>
      )}

      <div className="w-px h-5 bg-border mx-1" />

      <Button size="sm" onClick={handlePrint}>
        <Printer className="w-3.5 h-3.5" />
        Cetak
      </Button>
    </Card>
  )
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
