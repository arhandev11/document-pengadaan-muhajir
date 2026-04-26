# Backend Plan — Doc Manager (Laravel)

Dokumen ini adalah **rencana arsitektur backend** berdasarkan analisis di
`requirement.txt`. Belum ada kode; tujuan: menyepakati keputusan arsitektur
sebelum scaffold.

Tanggal: 2026-04-22

---

## 0. Decisions — LOCKED (2026-04-22)

| # | Keputusan | Nilai |
|---|---|---|
| D1 | Scope | **Single-org** (YMPI + Kimu). Tidak ada `organization_id`, tidak ada scoping multi-tenant. Kalau nanti butuh multi-tenant, migrasi schema menambahkan `organization_id` ke tabel terkait. |
| D2 | Frontend | **Tunda migrasi SPA.** Backend dikerjakan lebih dulu sebagai API-only. Frontend HTML lama tetap jalan standalone sampai SPA siap. Tidak ada Blade views untuk UI — hanya Blade untuk Print/PDF layout kalau perlu. |
| D3 | Auth | **Email/password + Sanctum** (token-based API). |
| D4 | PDF | **Tetap client-side** (`window.print()`). Backend HANYA menyimpan event "PRINT" / "EXPORT_PDF" di activity log. **Tidak perlu Browsershot, Puppeteer, atau queue worker untuk PDF.** |
| D5 | Struktur pasal | **Tabel relasional terpisah**: `pasal`, `poin`, `sub_poin`. Reorder via kolom `order` + Spatie `eloquent-sortable`. |
| D6 | Activity log | **Spatie activitylog** + Eloquent observer per model. |
| D7 | Versi history | **Snapshot eksplisit** (user-triggered), polymorphic. |
| D8 | DB | **MySQL 8**. |
| D9 | Logo storage | **Spatie Media Library** → disk lokal untuk MVP. |

Konsekuensi dari keputusan-keputusan ini:
- **Infra jadi lebih ringan**: tidak butuh Redis untuk PDF queue, tidak butuh
  headless Chrome di server. Cukup PHP-FPM + MySQL. Redis opsional untuk
  cache/session.
- **Roadmap lebih pendek**: hilang 3 hari fase 8 (PDF worker setup).
- **Audit trail jadi lebih granular otomatis**: karena pasal/poin/sub_poin
  adalah model Eloquent terpisah, observer akan log setiap perubahan row
  per-field — menutup gap §15.2 PRD tanpa kode tambahan.
- **Reorder kompleks**: pindah pasal ke-3 ke ke-1 butuh update 3 row `order`.
  Pakai `spatie/eloquent-sortable` agar transaksi aman.

---

## 1. Tech Stack (Usulan)

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Laravel 11** | LTS terbaru, minimal boilerplate |
| PHP | **8.3+** | Required Laravel 11 |
| Database | **MySQL 8** | D8 |
| Cache/Session | **Database driver** (awal) — upgrade ke Redis bila performa butuh | Tidak ada queue worker, tidak perlu Redis untuk MVP |
| Auth API | **Laravel Sanctum** | Token-based untuk SPA masa depan |
| Authorization | **Policies + Gate** | Per-dokumen permission |
| File storage | **Spatie Media Library** | Logo |
| Audit trail | **Spatie activitylog** | Field-level diff via observer |
| Reorder | **Spatie eloquent-sortable** | Pasal / poin / sub_poin |
| Validation | **Form Requests** | Per endpoint |
| API docs | **Scramble** | Auto-generate dari typed controller |
| Testing | **Pest** | Syntax ringkas |

**Packages yang DIHAPUS dari rencana sebelumnya** (akibat D4 = client-side):
- ~~Spatie Browsershot~~ (tidak generate PDF di server)
- ~~Puppeteer / headless Chrome~~
- ~~Redis sebagai requirement~~ (jadi opsional)

**Packages tambahan:**
- `spatie/laravel-permission` — roles (admin, editor, viewer)
- `spatie/laravel-backup` — backup DB terjadwal
- `barryvdh/laravel-debugbar` — dev only

---

## 2. Data Model (ERD Ringkas)

```
┌────────────────────┐
│ organizations      │  (multi-tenant ready, awal isi 1: YMPI)
│ id, name, slug,    │
│ created_at         │
└─────┬──────────────┘
      │ 1:N
      ▼
┌────────────────────┐       ┌────────────────────┐
│ users              │◄──N:N─│ roles              │
│ id, org_id, name,  │       └────────────────────┘
│ email, password    │
└─────┬──────────────┘
      │
      │ created_by
      ▼
┌────────────────────┐     ┌────────────────────┐
│ projects           │ 1:N │ parties            │
│ id, org_id,        │◄────│ id, org_id, role,  │
│ name, nomor_spk,   │     │ nama, jabatan,     │
│ tanggal_spk,       │     │ organisasi, alamat │
│ p1_party_id (FK),  │     └────────────────────┘
│ p2_party_id (FK)   │
└─────┬──────────────┘
      │ 1:1 atau 1:N (DECIDE: satu project bisa punya banyak surat?)
      ├─────────────────┬──────────────────┬──────────────────┐
      ▼                 ▼                  ▼                  ▼
┌────────────┐   ┌──────────────┐   ┌──────────────┐   ┌────────────┐
│ surat      │   │ berita_acara │   │ perjanjian   │   │ nda        │
│ penawaran  │   │              │   │              │   │            │
│ id,        │   │ id,          │   │ id, tipe     │   │ id, nomor, │
│ nomor,     │   │ nomor, hari, │   │ (barang|jasa)│   │ tanggal,   │
│ tanggal,   │   │ tanggal,     │   │ judul, nomor │   │ pihak_pn_* │
│ perihal,   │   │ tempat,      │   │ konsideran,  │   │ (receiving │
│ dst.       │   │ dst.         │   │ dst.         │   │  party)    │
└────┬───────┘   └────┬─────────┘   └─────┬────────┘   └────────────┘
     │ 1:N            │ 1:N               │ 1:N
     ▼                ▼                   ▼
┌────────────┐  ┌──────────────┐   ┌──────────────┐
│ surat_items│  │ berita_items │   │ pasal        │
└────────────┘  └──────────────┘   │ id, order,   │
                                    │ judul, intro │
                                    └──────┬───────┘
                                           │ 1:N
                                           ▼
                                    ┌──────────────┐
                                    │ poin         │
                                    │ id, order,   │
                                    │ text         │
                                    └──────┬───────┘
                                           │ 1:N
                                           ▼
                                    ┌──────────────┐
                                    │ sub_poin     │
                                    │ id, order,   │
                                    │ text         │
                                    └──────────────┘

┌────────────────────┐     ┌────────────────────┐
│ snapshots          │     │ activity_logs      │ (Spatie)
│ id, org_id,        │     │ id, log_name,      │
│ snapshotable_type  │     │ subject_type,      │
│ snapshotable_id,   │     │ subject_id,        │
│ data (JSON),       │     │ causer_id,         │
│ label, created_by  │     │ description,       │
└────────────────────┘     │ properties (JSON)  │
                           └────────────────────┘
```

### Mapping State → Tabel

| State key (frontend) | Backend table(s) |
|---|---|
| `state.project` (p1Nama, p1Jabatan, dst) | `projects` + 2 rows di `parties` |
| `state.surat` | `surat_penawaran` + `surat_items` |
| `state.berita` | `berita_acara` + `berita_items` |
| `state.perjanjian` | `perjanjian` + `pasal` + `poin` + `sub_poin` |
| `state.nda` | `nda` (single table, fields pn_* dan konteks) |
| `state.logs` | `activity_log` (Spatie) |
| `state.snapshots` | `snapshots` (polymorphic) |
| `state.logo` | Media Library collection on Organization |
| `state.collapsedPasal`, `logFilter`, `currentTab` | **Frontend only** — tidak perlu di-backend |

### Schema Detail — Tabel Relasional Pasal (D5)

```sql
-- perjanjian table
id               bigint PK
nomor            varchar(100) nullable
judul            varchar(255)
tipe             enum('barang','jasa')
tanggal          date
tempat           varchar(100)
hari_ttd         varchar(20) nullable
konsideran       text nullable
created_by       FK users.id
timestamps
soft_deletes

-- pasal table
id               bigint PK
perjanjian_id    FK perjanjian.id ON DELETE CASCADE
order_column     int NOT NULL
judul            varchar(255)
intro            text nullable
timestamps

UNIQUE KEY (perjanjian_id, order_column)
INDEX (perjanjian_id)

-- poin table
id               bigint PK
pasal_id         FK pasal.id ON DELETE CASCADE
order_column     int NOT NULL
text             text
timestamps

UNIQUE KEY (pasal_id, order_column)
INDEX (pasal_id)

-- sub_poin table
id               bigint PK
poin_id          FK poin.id ON DELETE CASCADE
order_column     int NOT NULL
text             text
timestamps

UNIQUE KEY (poin_id, order_column)
INDEX (poin_id)
```

**Reorder pakai `spatie/eloquent-sortable`**:
```php
class Pasal extends Model implements Sortable {
    use SortableTrait;
    public $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];
}

// Pindah pasal ke posisi tertentu:
Pasal::setNewOrder([3, 1, 2, 4, 5, 6, ...]); // array of IDs
```

Package otomatis update kolom `order_column` dalam satu transaksi.

**Pattern yang sama** dipakai di tabel `surat_items` dan `berita_items` (punya
`order_column` untuk menjaga urutan item yang diedit user).

**Cascade delete** menjamin hapus perjanjian → hapus semua pasal/poin/sub_poin.
Namun tetap tambahkan confirm di frontend (menutup §15.23 dan §15.17 PRD).

---

## 3. API Surface

RESTful, prefix `/api/v1`. Semua route (kecuali `/login`) require Sanctum token.

### Resource: Project

```
GET    /api/v1/projects                # list (paginated, org-scoped)
POST   /api/v1/projects                # create (termasuk p1, p2 inline)
GET    /api/v1/projects/{id}           # show dengan eager-load semua dokumen
PATCH  /api/v1/projects/{id}           # partial update
DELETE /api/v1/projects/{id}           # soft delete
```

### Resource: Surat Penawaran (nested under project)

```
GET    /api/v1/projects/{pid}/surat
POST   /api/v1/projects/{pid}/surat
GET    /api/v1/surat/{id}
PATCH  /api/v1/surat/{id}
DELETE /api/v1/surat/{id}

POST   /api/v1/surat/{id}/items        # add item
PATCH  /api/v1/surat/items/{itemId}
DELETE /api/v1/surat/items/{itemId}
```

Pola serupa untuk `berita`, `perjanjian`, `nda`.

### Resource: Snapshot

```
POST   /api/v1/{type}/{id}/snapshots
GET    /api/v1/{type}/{id}/snapshots
POST   /api/v1/snapshots/{id}/restore  # apply → return updated document
DELETE /api/v1/snapshots/{id}
```

Dengan `{type}` ∈ {`projects`, `surat`, `berita`, `perjanjian`, `nda`}.

### Resource: Activity Log

```
GET    /api/v1/activity                # filter: ?subject_type=surat&causer_id=X
GET    /api/v1/activity/stats          # counts per action/type (untuk stat cards)
```

### Resource: Export

```
POST   /api/v1/{type}/{id}/export/pdf  # queue job → return job_id
POST   /api/v1/{type}/{id}/export/html
GET    /api/v1/exports/{jobId}         # poll status
GET    /api/v1/exports/{jobId}/download

GET    /api/v1/backup/full             # full backup (project+all docs+logs+snapshots)
```

### Resource: Logo

```
POST   /api/v1/organizations/{id}/logo
DELETE /api/v1/organizations/{id}/logo
```

### Auth

```
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
```

---

## 4. Authorization Model (Usulan)

Tiga role default:
- **Admin** — kelola user, org settings, logo, semua dokumen
- **Editor** — buat, edit, ekspor dokumen; tidak bisa hapus snapshot orang lain
- **Viewer** — read-only + download PDF

Policy per model:
```php
ProjectPolicy::view($user, $project)     // same org
ProjectPolicy::update($user, $project)   // role !== viewer
SuratPolicy::delete($user, $surat)       // admin only
SnapshotPolicy::restore($user, $snap)    // admin/editor
```

Semua query otomatis di-scope `->where('org_id', $user->org_id)` via global scope
di model.

---

## 5. Audit Trail — Replikasi Debounced EDIT Log

Ini adalah fitur paling kritis untuk dipindahkan dengan benar. Ada dua opsi:

### Opsi A — Frontend debounces, backend stores (tiru persis current behavior)
- Frontend tetap tahan perubahan 1.6 detik, lalu kirim PATCH.
- Backend pakai Eloquent observer untuk log diff otomatis via Spatie activitylog.
- Keuntungan: simple, matches current UX, 1 request per idle.

### Opsi B — Frontend stream setiap keystroke, backend batch/dedupe
- Kirim setiap oninput via WebSocket / throttled POST.
- Backend aggregate per user per field per window.
- Keuntungan: real-time multi-user visibility.
- Kerugian: kompleks, overkill untuk internal tool.

**Rekomendasi: Opsi A.**

### Menutup gap §15.2 (log granular untuk items/pasal/poin)

Di backend, karena items & poin jadi row terpisah, observer otomatis log
perubahan mereka tanpa effort tambahan — masalah yang ada di frontend hilang:

```php
SuratItem::observe(ActivityLogObserver::class);
Poin::observe(ActivityLogObserver::class);
// dst.
```

Properties di activity log menyimpan `old`, `new`, dan `diff` otomatis.

---

## 6. PDF/HTML Export Strategy (D4 = client-side)

**PDF generation TETAP di browser.** Backend TIDAK merender PDF.

### Tanggung jawab backend untuk export

| Fungsi | Tindakan |
|---|---|
| `window.print()` / Save as PDF | Frontend call `POST /api/v1/{type}/{id}/events` body `{action:"PRINT"}` atau `{action:"EXPORT_PDF"}`. Backend hanya tulis ke activity log. Tidak ada file PDF disimpan server. |
| Save as HTML | Frontend generate HTML lokal (seperti sekarang). Backend tulis log `EXPORT_HTML`. Opsional: `GET /api/v1/{type}/{id}/html` kembalikan HTML string render-ready agar frontend tidak perlu duplikasi template. |
| Save as JSON | Frontend fetch `GET /api/v1/{type}/{id}` → convert → download. Log `EXPORT_JSON`. |
| Full backup | `GET /api/v1/backup/full` → JSON lengkap (project + all docs + logs + snapshots). Menutup gap §15.11 PRD. |

### Konsekuensi tetap client-side

| Gap PRD yang TIDAK tertutup backend | Catatan |
|---|---|
| §15.16 (snapshot integrity hash) | Tetap bisa: hitung SHA256 dari JSON snapshot di backend saat simpan. Tidak perlu PDF untuk ini. |
| §15.20 (page number di PDF) | **TIDAK tertutup** — client-side print tidak bisa tambah footer halaman dari aplikasi. Browser punya print preset untuk nomor halaman (user atur manual). |
| Konsistensi visual lintas browser | **TIDAK tertutup** — Chrome/Firefox/Safari bisa render print berbeda. Trade-off yang diterima. |

### Endpoint events (sederhana)

```
POST /api/v1/events
Body: {
  action: "PRINT" | "EXPORT_PDF" | "EXPORT_HTML" | "EXPORT_JSON",
  subject_type: "surat" | "berita" | "perjanjian" | "nda" | "project",
  subject_id: int
}
```

Backend cukup resolve subject → tulis ke `activity_log`. Tidak ada file I/O.

---

## 7. Migrasi dari localStorage

Satu-shot importer:
```
POST /api/v1/import/legacy-localstorage
Body: { kimu_project, kimu_surat, kimu_berita, kimu_perjanjian, kimu_nda,
        kimu_logs, kimu_snapshots, kimu_logo }
```

User buka halaman lama, salin semua key localStorage ke field, klik import.
Atau: tombol "Export for Migration" di frontend lama → JSON → upload di
backend baru.

---

## 8. Rencana Fase Pengembangan (locked)

| Fase | Durasi | Deliverable |
|---|---|---|
| **0. Scaffold** | 1 hari | `composer create-project laravel/laravel backend`, install Sanctum, Spatie (activitylog, permission, media-library, eloquent-sortable), konfigurasi `.env`, `.editorconfig`, CI (GitHub Actions) |
| **1. Auth + User + Role** | 1 hari | User seed (admin@test.com/12341234), login endpoint, middleware auth, role assignment |
| **2. Party + Project** | 2 hari | Migrations + models + controllers + Form Requests + API Resources + test |
| **3. Surat Penawaran** | 2 hari | CRUD surat + surat_items (sortable) + test |
| **4. Berita Acara** | 1 hari | Pattern sama |
| **5. Perjanjian** | 3 hari | CRUD perjanjian + pasal + poin + sub_poin (3 level sortable) + `PasalTemplateSeeder` (13 Barang + 12 Jasa) + endpoint `POST /perjanjian/{id}/reset-template?tipe=jasa` |
| **6. NDA** | 1 hari | CRUD nda — dengan NDA ikut di export pipeline dari awal (menutup §15.1) |
| **7. Snapshot + Restore** | 2 hari | Polymorphic `snapshots` table, `data_hash` SHA256 (menutup §15.16), `POST /snapshots/{id}/restore` |
| **8. Activity Log** | 2 hari | Spatie activitylog + observer global untuk semua model + `GET /activity` dengan filter + stat endpoint |
| **9. Events + Export metadata** | 0.5 hari | `POST /events` untuk PRINT/EXPORT_PDF/EXPORT_HTML/EXPORT_JSON + `GET /backup/full` |
| **10. Logo** | 0.5 hari | Spatie Media Library, validasi 2MB + resize otomatis ke 300px (menutup §15.8) |
| **11. Migration Tool** | 1 hari | `POST /import/legacy-localstorage` — terima JSON dump localStorage lama |
| **12. Hardening** | 1 hari | Rate limit login, schedule prune activity_log >90 hari (menutup §15.9), schedule backup |
| **Total** | **~17 hari kerja** | (turun dari 22 karena tidak ada Browsershot/queue — D4) |

Catatan:
- Fase 0–6 = **MVP backend**. Setelah fase 6, API sudah cukup untuk dipakai
  frontend HTML lama (dengan diubah `localStorage.setItem` → `fetch PATCH`).
- Fase 7–12 = iterative enhancement.

---

## 9. Struktur Direktori (Usulan)

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AuthController.php
│   │   ├── ProjectController.php
│   │   ├── SuratController.php
│   │   ├── SuratItemController.php
│   │   ├── BeritaController.php
│   │   ├── PerjanjianController.php
│   │   ├── PasalController.php
│   │   ├── NdaController.php
│   │   ├── SnapshotController.php
│   │   ├── ActivityController.php
│   │   └── ExportController.php
│   ├── Requests/
│   │   └── (Form Request per action)
│   └── Resources/
│       └── (API Resources untuk serialization)
├── Models/
│   ├── Organization.php
│   ├── User.php
│   ├── Party.php
│   ├── Project.php
│   ├── SuratPenawaran.php
│   ├── SuratItem.php
│   ├── BeritaAcara.php
│   ├── BeritaItem.php
│   ├── Perjanjian.php
│   ├── Pasal.php            (atau hilang jika D5=JSON)
│   ├── Poin.php             (atau hilang jika D5=JSON)
│   ├── SubPoin.php          (atau hilang jika D5=JSON)
│   ├── Nda.php
│   └── Snapshot.php
├── Policies/
├── Observers/
│   └── ActivityLogObserver.php
├── Jobs/
│   ├── ExportPdfJob.php
│   └── ExportHtmlJob.php
├── Services/
│   ├── DocumentExporter.php
│   ├── SnapshotService.php
│   └── PasalTemplate.php   (templateBarang / templateJasa → seed data)
└── Support/
    └── DiffFormatter.php

database/
├── migrations/
└── seeders/
    ├── DatabaseSeeder.php
    ├── OrganizationSeeder.php
    ├── PasalTemplateSeeder.php  (13 pasal Barang + 12 pasal Jasa)
    └── DemoProjectSeeder.php

resources/views/
├── documents/
│   ├── surat.blade.php
│   ├── berita.blade.php
│   ├── perjanjian.blade.php
│   └── nda.blade.php
└── layouts/
    └── document.blade.php

routes/
└── api.php

tests/
├── Feature/
│   ├── ProjectApiTest.php
│   ├── SuratApiTest.php
│   ├── SnapshotRestoreTest.php
│   └── ExportPdfTest.php
└── Unit/
    └── DiffFormatterTest.php
```

---

## 10. Hal yang Akan Saya Perbaiki Saat Migrasi (dari §17 PRD)

Backend adalah kesempatan menutup beberapa gap temuan. Direncanakan:

| Gap | Solusi di Backend |
|---|---|
| §15.1 NDA ghosted | NDA ikut schema & export pipeline dari awal |
| §15.2 Diff tidak granular | Observer Eloquent log per-row per-field |
| §15.3 CREATE never fired | Observer `created` event auto-log |
| §15.8 Logo quota | Validasi max 2MB di Form Request + resize via Intervention Image |
| §15.9 Log rotation | Schedule prune >90 hari (config-able) |
| §15.16 Snapshot hash | Kolom `data_hash` SHA256 di snapshots |
| §15.20 Page number PDF | Footer Blade dengan Browsershot header/footer template |
| §15.24 Tanggal default | Semua dokumen default `now()` |

---

## 11. Yang TIDAK Akan Dimigrasikan (tetap di frontend)

- `collapsedPasal` — UI state.
- `currentTab` — bisa di URL (`/projects/1/surat`).
- `logFilter` — query string (`?filter=surat`).
- Toast notification — UI concern.
- Debounce timer — frontend tetap tanggung jawab kirim saat user idle.
- `esc()` HTML escaping — Laravel Blade auto-escapes.

---

## 12. Status & Next Step

Keputusan arsitektur sudah lengkap (§0). Yang masih perlu Anda tentukan adalah
hal teknis sebelum `composer create-project`:

- **Lokasi project**: `backend/` sebagai subfolder dari
  `/home/arhandev/data/kerja/muhajir/`, atau direktori lain?
- **Nama aplikasi/repo**: `doc-manager-backend` / `kimu-backend` / lainnya?
- **PHP runtime tersedia lokal?** Jalankan `php -v` dan `composer -V` untuk
  konfirmasi sebelum scaffold.
- **MySQL lokal**: apakah sudah ada instance jalan, atau perlu Docker
  compose?

Saya tunggu jawaban singkat, lalu fase 0 (scaffold Laravel 11 + install
packages + migrasi awal) bisa saya mulai.
