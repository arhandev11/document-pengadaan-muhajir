export interface BeritaItem {
  id: number
  berita_acara_id: number
  order_column: number
  nama: string | null
  jumlah: string | null
  spesifikasi: string | null
  kondisi: string | null
}

export interface Berita {
  id: number
  project_id: number
  nomor: string | null
  hari: string | null
  tanggal: string | null
  tempat: string | null
  nama_kegiatan: string | null
  tempat_buat: string | null
  tanggal_buat: string | null
  items: BeritaItem[]
  created_by?: { id: number; name: string }
  created_at: string | null
  updated_at: string | null
}

export interface BeritaHeaderInput {
  nomor?: string | null
  hari?: string | null
  tanggal?: string | null
  tempat?: string | null
  nama_kegiatan?: string | null
  tempat_buat?: string | null
  tanggal_buat?: string | null
}

export interface BeritaItemInput {
  nama?: string | null
  jumlah?: string | null
  spesifikasi?: string | null
  kondisi?: string | null
}

export interface BeritaCreateInput extends BeritaHeaderInput {
  items?: BeritaItemInput[]
}
