# Doc Manager

Aplikasi manajemen dokumen pengadaan untuk Yayasan Muhajir Peduli Indonesia
× PT Kimu Edu Indonesia. Migrasi dari single-file `Doc Manager.html` ke
arsitektur fullstack modern.

## Struktur Repo

```
muhajir/
├── Doc Manager.html        # Source asli — single-file localStorage app (1577 lines)
├── requirement.txt         # PRD lengkap hasil analisis (1119 baris)
├── backend_plan.md         # Architecture decision record
├── backend/                # Laravel 12 API (lihat backend/README.md)
└── frontend/               # React 19 SPA (lihat frontend/README.md)
```

## Apa yang Dimigrasikan

| Doc Manager.html (asli) | Doc Manager (sekarang) |
|---|---|
| Single user, no auth | Multi-user dengan RBAC (admin/editor/viewer) |
| localStorage browser | MySQL backend + REST API |
| 1 project (singleton) | Multi-project per organisasi |
| Audit log shallow | Field-level diff via Spatie observer |
| Snapshot di-localStorage | Polymorphic snapshot dengan hash integrity |
| Logo base64 di localStorage | Spatie Media Library + storage |
| Hardcoded YMPI/Kimu | Generic, data via Setup Proyek |
| 4 dokumen + Riwayat | Sama, plus Settings page |

## Quick Start

Perlu 2 terminal — satu untuk backend, satu untuk frontend.

```bash
# Terminal 1 — Backend (Laravel)
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Edit .env — set DB_*
mysql -u root -p -e "CREATE DATABASE doc_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve --port=8765

# Terminal 2 — Frontend (React + Bun)
cd frontend
bun install
bun dev
# → http://localhost:5173
```

Login dengan `admin@test.com` / `12341234`.

## Stack Singkat

**Backend**: Laravel 12 + PHP 8.3 + MySQL 8 + Sanctum + Spatie suite (activitylog, permission, media, sortable)

**Frontend**: Bun + Vite + React 19 + TypeScript + Tailwind v4 + shadcn/ui + TanStack Query + React Router

**Bundle Frontend**: 105 KB gzipped initial, code-split per route

## Dokumen Penting

- [`requirement.txt`](./requirement.txt) — PRD hasil reverse-engineering Doc Manager.html, plus 32 deep findings (gaps, inkonsistensi, rekomendasi)
- [`backend_plan.md`](./backend_plan.md) — Architecture decision record dengan 9 D-points yang sudah locked
- [`backend/README.md`](./backend/README.md) — Setup, API surface, RBAC, audit trail
- [`frontend/README.md`](./frontend/README.md) — Stack, folder structure, deploy

## Keputusan Arsitektur Utama

| ID | Keputusan | Nilai |
|---|---|---|
| D1 | Scope | Single-org (YMPI + Kimu) |
| D2 | Frontend | React 19 SPA dengan code-splitting |
| D3 | Auth | Email/password + Sanctum bearer token |
| D4 | PDF | Client-side `window.print()`, backend log event |
| D5 | Pasal schema | Tabel relasional terpisah (pasal/poin/sub_poin) |
| D6 | Activity log | Spatie activitylog v5 dengan field-level diff |
| D7 | Snapshot | Polymorphic + SHA256 data_hash |
| D8 | Database | MySQL 8 |
| D9 | Logo storage | Spatie Media Library, public disk |

Lihat `backend_plan.md` untuk konteks lengkap setiap keputusan.

## Demo Credentials

Setelah `php artisan db:seed`, 3 user demo aktif (semua password `12341234`):

| Email | Role | Akses |
|---|---|---|
| `admin@test.com` | admin | Full (30 permissions) |
| `admin1@test.com` | editor | Buat & edit dokumen, restore snapshot (26) |
| `admin2@test.com` | viewer | Read-only + export (9) |

## Status Project

| Komponen | Commits | LOC | Status |
|---|:-:|:-:|:-:|
| Backend | 10 | ~4K PHP | Feature-complete |
| Frontend | 13 | ~10K TSX | Feature-complete |
| Docs | — | — | README + PRD + plan |
| Tests | — | — | Manual via curl, Pest belum populated |

## Roadmap Berikutnya (Opsional)

- [ ] Pest tests untuk backend (regression protection)
- [ ] Server-side PDF generation (upgrade dari D4 client-side via Browsershot)
- [ ] WebSocket untuk live activity log multi-user (Laravel Reverb)
- [ ] Multi-tenant migration (kalau YMPI ingin scale ke organisasi lain)
- [ ] Mobile-responsive polish untuk Perjanjian editor
- [ ] E2E tests dengan Playwright

## Lisensi & Kepemilikan

Internal use untuk Yayasan Muhajir Peduli Indonesia × PT Kimu Edu Indonesia.

---

**Tip**: Untuk understand kode lebih dalam, baca dengan urutan ini:

1. `Doc Manager.html` — kenali domain & UX original
2. `requirement.txt` — pahami detail fitur per-tab
3. `backend_plan.md` — kenapa keputusan teknis dibuat
4. `backend/README.md` + walk through `routes/api.php`
5. `frontend/README.md` + walk through `src/App.tsx` routing
