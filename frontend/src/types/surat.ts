export interface SuratItem {
  id: number
  surat_penawaran_id: number
  order_column: number
  nama: string | null
  spesifikasi: string | null
  jumlah: string | null
  harga_satuan: string | null
  total: number
}

export interface Surat {
  id: number
  project_id: number
  nomor: string | null
  tanggal: string | null
  perihal: string | null
  nama_program: string | null
  garansi: string | null
  waktu_kirim: string | null
  masa_berlaku: string | null
  items: SuratItem[]
  grand_total: number | null
  created_by?: { id: number; name: string }
  created_at: string | null
  updated_at: string | null
}

export interface SuratHeaderInput {
  nomor?: string | null
  tanggal?: string | null
  perihal?: string | null
  nama_program?: string | null
  garansi?: string | null
  waktu_kirim?: string | null
  masa_berlaku?: string | null
}

export interface SuratItemInput {
  nama?: string | null
  spesifikasi?: string | null
  jumlah?: string | null
  harga_satuan?: string | null
}

export interface SuratCreateInput extends SuratHeaderInput {
  items?: SuratItemInput[]
}
