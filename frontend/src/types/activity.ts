export type ActivityAction =
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'RESTORE'
  | 'PRINT'
  | 'EXPORT_PDF'
  | 'EXPORT_HTML'
  | 'EXPORT_JSON'
  | 'SNAPSHOT'
  | 'UPLOADED'
  | 'REMOVED'
  | 'LEGACY_IMPORTED'
  | string

export type ActivityDocType = 'project' | 'surat' | 'berita' | 'perjanjian' | 'nda' | string

export interface ActivityChanges {
  attributes?: Record<string, unknown>
  old?: Record<string, unknown>
}

export interface Activity {
  id: number
  log_name: string
  doc_type: ActivityDocType
  event: string | null
  action: ActivityAction
  description: string
  subject_type: string | null
  subject_id: number | null
  causer?: { id: number; name: string } | null
  changes?: ActivityChanges | null
  properties?: Record<string, unknown> | null
  created_at: string | null
}

export interface ActivityStats {
  total: number
  recent_1h: number
  recent_24h: number
  by_action: Record<string, number>
  by_doc_type: Record<ActivityDocType, number>
  by_log_name: Record<string, number>
}

export interface ActivityFilters {
  doc_type?: ActivityDocType
  event?: string
  subject_id?: number
  causer_id?: number
  date_from?: string
  date_to?: string
  per_page?: number
  page?: number
}
