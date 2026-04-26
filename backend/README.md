# Doc Manager — Backend

Laravel 12 API backend untuk Doc Manager. Mengelola 5 jenis entitas
(Project, Surat Penawaran, Berita Acara, Perjanjian, NDA) dengan audit
trail granular, snapshot/restore, dan role-based access control.

## Prasyarat

- PHP 8.3+
- Composer 2.x
- MySQL 8 (atau kompatibel)
- Node tidak diperlukan (frontend di repo terpisah)

## Setup Pertama Kali

```bash
# 1. Clone & install dependencies
composer install

# 2. Konfigurasi environment
cp .env.example .env
php artisan key:generate

# 3. Edit .env — minimum:
#    DB_DATABASE, DB_USERNAME, DB_PASSWORD
#    APP_LOCALE=id, APP_TIMEZONE=Asia/Jakarta

# 4. Buat database (kalau belum ada)
mysql -u root -p -e "CREATE DATABASE doc_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 5. Migrasi + seed
php artisan migrate
php artisan db:seed

# 6. Symlink storage (untuk logo upload)
php artisan storage:link

# 7. Jalankan dev server
php artisan serve --port=8765
```

Setelah seed, 3 user demo tersedia (semua password `12341234`):

| Email | Role | Permissions |
|---|---|---|
| `admin@test.com` | admin | 30 (full access) |
| `admin1@test.com` | editor | 26 (no admin actions) |
| `admin2@test.com` | viewer | 9 (read + export) |

## Struktur API

Semua endpoint di prefix `/api/v1` dengan Sanctum bearer token (kecuali `/auth/login`).

### Auth (3 endpoints)
- `POST /auth/login` — body `{email, password, device_name?}`, return `{token, user}`
- `GET /auth/me` — current user info
- `POST /auth/logout` — invalidate current token

### Projects, Surat, Berita, Perjanjian, NDA (40+ endpoints)
Pattern konsisten:
- `GET /projects` (list dengan search & pagination)
- `POST /projects` (create)
- `GET /projects/{id}` (detail dengan eager-load)
- `PATCH /projects/{id}` (partial update)
- `DELETE /projects/{id}` (soft delete)

Untuk dokumen turunan dengan project parent:
- `GET /projects/{id}/{type}` (list scoped ke project)
- `POST /projects/{id}/{type}` (create dalam project)
- `GET|PATCH|DELETE /{type}/{id}` (operasi langsung)

Items / pasal / poin / sub-poin punya endpoint terpisah:
- `POST /surat/{id}/items`, `PATCH /surat-items/{id}`, dst.
- `POST /surat/{id}/items/reorder` (body `{ids: [3,1,2]}`)

### Cross-cutting (15 endpoints)
- `GET|POST|DELETE /{type}/{id}/snapshots` — polymorphic snapshot
- `POST /snapshots/{id}/restore`
- `GET /activity?doc_type=...` — filtered activity log
- `GET /activity/stats` — counts untuk stat cards
- `POST /events` body `{action, subject_type, subject_id}` — log Print/Export
- `GET /backup/full` — full JSON backup
- `GET|POST|DELETE /logo` — singleton logo upload
- `POST /import/legacy-localstorage` — migrate dari frontend lama

Total: **65 routes**. Lihat lengkapnya: `php artisan route:list --path=api/v1`.

## Permissions (RBAC)

30 permissions di-generate oleh `RolePermissionSeeder`:
- `{type}.view|create|update|delete` × 5 entity = 20
- `snapshot.create|restore|delete` = 3
- `activity.view|delete` = 2
- `export.pdf|html|json` = 3
- `user.manage`, `logo.manage` = 2

Frontend cek via `User.permissions[]` array (returned di login response).

## Audit Trail

Semua mutasi tercatat otomatis ke `activity_log` table via Spatie observer.
Diff field-level disimpan di kolom `attribute_changes` JSON:

```json
{
  "old": {"nomor_spk": "001/..."},
  "attributes": {"nomor_spk": "002/..."}
}
```

Activity log auto-purge >365 hari via scheduled command (`activitylog:clean`
daily 03:00). Tunable via env `ACTIVITYLOG_CLEAN_DAYS`.

## Snapshot & Restore

Polymorphic `snapshots` table dengan `data_hash` (SHA256) untuk integrity check.
Restore strategi:
- Top-level fields: update in-place (preserve entity ID)
- Nested children (items, pasal): delete-and-recreate dari snapshot data

Lihat `App\Services\SnapshotService` untuk detail.

## Rate Limits

- `auth/login`: 6 req/min/IP
- `backup/full`: 3 req/min/IP (heavy query)
- `import/legacy-localstorage`: 2 req/min/IP (non-idempotent)
- `perjanjian/{id}/reset-template`: 3 req/min/IP (destructive)

## Deployment

```bash
# Build optimized
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache

# Schedule (untuk log rotation)
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

Set env production:
```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com
SESSION_DRIVER=redis
```

## Stack

- **Laravel 12.57** + PHP 8.3+
- **MySQL 8** (utf8mb4)
- **Sanctum** (token-based API auth)
- **Spatie**: activitylog v5, permission, media-library, eloquent-sortable
- **Pest** (testing — belum populated, see `tests/`)

## Struktur Folder

```
app/
├── Http/Controllers/Api/V1/   # 14 controllers
├── Http/Requests/             # Form requests grouped by feature
├── Http/Resources/            # JSON serialization
├── Models/                    # 12 Eloquent models
│   └── Concerns/              # HasSnapshots trait
├── Services/                  # PerjanjianService, SnapshotService, dll.
└── Support/                   # PasalTemplate (Barang/Jasa data)

database/
├── migrations/                # 17 migrations
└── seeders/                   # Role, AdminUser, AppSetting

routes/api.php                 # Single file, 65 routes
```

## Troubleshooting

**"SQLSTATE[42S01] Table already exists"** saat migrate:
Migration timestamps duplikat. Cek `database/migrations/` dan rename
file dengan timestamp terlambat 1-2 detik.

**"Class not found: Spatie\..."** setelah composer require:
```bash
composer dump-autoload
php artisan config:clear
```

**Logo upload gagal "must be file of type"**:
Backend hanya terima `image/png`, `image/jpeg`, `image/svg+xml`.
Cek mime type sebenarnya pakai `file --mime-type yourimage`.
