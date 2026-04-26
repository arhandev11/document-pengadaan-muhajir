import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DocPaperProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper "kertas A4" — mirror styling Doc Manager.html .doc-paper.
 * Konsisten antar dokumen: white bg, padding generous, shadow tipis.
 * Print-friendly: padding di-reset oleh @media print di index.css nanti.
 */
export function DocPaper({ children, className }: DocPaperProps) {
  return (
    <div
      className={cn(
        'doc-paper bg-white text-[#111] rounded-sm shadow-md mx-auto',
        'px-12 py-14 md:px-16 md:py-16',
        'max-w-[860px] min-h-[1000px]',
        'font-sans text-[12.5px] leading-[1.75]',
        className,
      )}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {children}
    </div>
  )
}
