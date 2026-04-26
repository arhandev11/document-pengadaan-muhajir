export interface Nda {
  id: number
  project_id: number
  nomor: string | null
  hari: string | null
  tanggal: string | null
  tempat: string | null
  pihak_penerima: {
    nama: string | null
    ktp: string | null
    alamat: string | null
    jabatan: string | null
    organisasi: string | null
    nomor_kontrak: string | null
    tanggal_kontrak: string | null
  }
  pihak_pengungkap: {
    nama: string | null
    jabatan: string | null
    perusahaan: string | null
    alamat: string | null
  } | null
  konteks_pelaksanaan: string | null
  jenis_dukungan: string | null
  objek_kegiatan: string | null
  objek_informasi: string | null
  jangka_waktu: string | null
  created_by?: { id: number; name: string }
  created_at: string | null
  updated_at: string | null
}

/**
 * Flat shape untuk POST/PATCH — konversi dari form `pihak_penerima.xxx`
 * (response) ke `pn_xxx` (request).
 */
export interface NdaInput {
  nomor?: string | null
  hari?: string | null
  tanggal?: string | null
  tempat?: string | null
  pn_nama?: string | null
  pn_ktp?: string | null
  pn_alamat?: string | null
  pn_jabatan?: string | null
  pn_organisasi?: string | null
  pn_nomor_kontrak?: string | null
  pn_tanggal_kontrak?: string | null
  konteks_pelaksanaan?: string | null
  jenis_dukungan?: string | null
  objek_kegiatan?: string | null
  objek_informasi?: string | null
  jangka_waktu?: string | null
}
