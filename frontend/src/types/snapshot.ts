export type SnapshotableType = 'projects' | 'surat' | 'berita' | 'perjanjian' | 'nda'

export interface Snapshot {
  id: number
  snapshotable_type: string
  snapshotable_id: number
  label: string
  data_hash: string
  data?: Record<string, unknown>
  created_by?: { id: number; name: string }
  created_at: string | null
}
