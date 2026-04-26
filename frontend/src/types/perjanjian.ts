export type PerjanjianTipe = 'barang' | 'jasa'

export interface SubPoin {
  id: number
  poin_id: number
  order_column: number
  text: string | null
}

export interface Poin {
  id: number
  pasal_id: number
  order_column: number
  text: string | null
  sub: SubPoin[]
}

export interface Pasal {
  id: number
  perjanjian_id: number
  order_column: number
  judul: string | null
  intro: string | null
  poin: Poin[]
}

export interface Perjanjian {
  id: number
  project_id: number
  tipe: PerjanjianTipe
  nomor: string | null
  judul: string | null
  tanggal: string | null
  tempat: string | null
  hari_ttd: string | null
  konsideran: string | null
  pasal: Pasal[]
  pasal_count?: number
  created_by?: { id: number; name: string }
  created_at: string | null
  updated_at: string | null
}

export interface PerjanjianCreateInput {
  tipe: PerjanjianTipe
  nomor?: string | null
  judul?: string | null
  tanggal?: string | null
  tempat?: string | null
  hari_ttd?: string | null
  konsideran?: string | null
  use_template?: boolean
}

export interface PerjanjianUpdateInput {
  nomor?: string | null
  judul?: string | null
  tanggal?: string | null
  tempat?: string | null
  hari_ttd?: string | null
  konsideran?: string | null
}
