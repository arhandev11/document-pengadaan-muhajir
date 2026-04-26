/**
 * Mirror helpers dari Doc Manager.html line 263-264:
 *   toNum(v) = parseInt(String(v||"").replace(/\D/g,""),10)||0
 *   toRp(v)  = toNum(v) ? nToIDLocale : ""
 */
export function toNum(value: string | number | null | undefined): number {
  if (value == null) return 0
  const digits = String(value).replace(/\D/g, '')
  return digits ? Number.parseInt(digits, 10) : 0
}

export function toRp(value: string | number | null | undefined): string {
  const n = toNum(value)
  return n ? n.toLocaleString('id-ID') : ''
}

export function computeItemTotal(
  jumlah: string | number | null | undefined,
  hargaSatuan: string | number | null | undefined,
): number {
  return toNum(jumlah) * toNum(hargaSatuan)
}
