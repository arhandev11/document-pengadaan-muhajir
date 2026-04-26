export interface Project {
  id: number
  name: string
  p1: {
    nama: string | null
    jabatan: string | null
    perusahaan: string | null
    alamat: string | null
  }
  p2: {
    nama: string | null
    jabatan: string | null
    organisasi: string | null
    alamat: string | null
  }
  spk: {
    nomor: string | null
    tanggal: string | null
  }
  created_by?: { id: number; name: string }
  created_at: string | null
  updated_at: string | null
}

/**
 * Shape flat untuk POST/PATCH — konversi dari form camelCase UI
 * ke snake_case API.
 */
export interface ProjectInput {
  name: string
  p1_nama?: string | null
  p1_jabatan?: string | null
  p1_perusahaan?: string | null
  p1_alamat?: string | null
  p2_nama?: string | null
  p2_jabatan?: string | null
  p2_organisasi?: string | null
  p2_alamat?: string | null
  nomor_spk?: string | null
  tanggal_spk?: string | null
}

export interface Paginated<T> {
  data: T[]
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}
