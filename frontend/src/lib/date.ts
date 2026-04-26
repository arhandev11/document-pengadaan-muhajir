/**
 * Format tanggal Indonesia "dd Bulan yyyy" — mirror todayStr di Doc Manager.html.
 * Dipakai untuk default value form tanggal saat create dokumen baru.
 */
export function todayId(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Nama hari Indonesia ("Senin", "Selasa", dll.) untuk hari ini.
 */
export function todayDayName(): string {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long' })
}
