# Doc Manager — Frontend

React 19 + TypeScript SPA untuk Doc Manager. Mengkonsumsi backend Laravel
via REST API. Ini adalah migrasi dari `Doc Manager.html` (single-file
localStorage app) ke arsitektur modern dengan auth, multi-user, snapshot,
dan code-splitting.

## Prasyarat

- Bun 1.3+ (atau Node 20+ jika prefer npm)
- Backend running di `http://localhost:8765` (lihat `../backend/README.md`)

## Setup Pertama Kali

```bash
# Install dependencies
bun install

# Jalankan dev server
bun dev
# → http://localhost:5173
```

Itu saja. Tidak ada step `.env` karena Vite proxy otomatis forward
`/api/*` dan `/storage/*` ke backend localhost:8765.

## Login

Setelah login dengan demo credentials (lihat backend README), token
disimpan di `localStorage` key `doc_manager_token`. Auto-redirect ke
`/login` saat token invalid (axios interceptor).

## Arsitektur

### Stack
- **Bun 1.3** + **Vite 8** (build) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config via `@theme` di `index.css`)
- **shadcn/ui** (new-york style — copy-paste registry, 11 komponen)
- **React Router 7** classic mode + **TanStack Query 5** (server state)
- **React Hook Form 7** + **Zod 4** (form + validation)
- **lucide-react** (icons), **sonner** (toast)

### Folder Structure
```
src/
├── App.tsx                # Router + QueryClientProvider
├── main.tsx               # Entry point
├── index.css              # Tailwind v4 @theme + print styles
├── components/
│   ├── ui/                # shadcn primitives (button, card, dll)
│   ├── perjanjian/        # PasalCard, PoinRow, SubPoinRow
│   ├── preview/           # SuratPreview, BeritaPreview, dll (4 docs)
│   ├── AppLayout.tsx      # Topbar + tab nav + Outlet
│   ├── ProtectedRoute.tsx # Auth guard
│   ├── DocActionsBar.tsx  # Print/Export buttons (sticky top)
│   ├── SnapshotsPanel.tsx # Polymorphic snapshot UI
│   └── ...                # Form & item managers
├── hooks/
│   ├── use-auth.ts        # useCurrentUser, useLogin, useLogout
│   ├── use-projects.ts    # CRUD projects
│   ├── use-surat.ts       # Surat + items
│   ├── use-berita.ts      # Berita + items
│   ├── use-perjanjian.ts  # Pasal + poin + sub_poin (16 hooks)
│   ├── use-nda.ts
│   ├── use-snapshots.ts
│   ├── use-activity.ts    # Activity log + stats
│   ├── use-events.ts      # Log Print/Export events
│   ├── use-logo.ts
│   └── use-debounced-text.ts  # Reusable inline-edit hook
├── lib/
│   ├── api.ts             # Axios instance + bearer token + 401 redirect
│   ├── currency.ts        # toNum, toRp, computeItemTotal (mirror frontend lama)
│   └── utils.ts           # cn() helper
├── pages/
│   ├── LoginPage.tsx
│   ├── ProjectListPage.tsx + ProjectDetailPage.tsx
│   ├── SuratListPage.tsx + SuratDetailPage.tsx
│   ├── BeritaListPage.tsx + BeritaDetailPage.tsx
│   ├── PerjanjianListPage.tsx + PerjanjianDetailPage.tsx
│   ├── NdaListPage.tsx + NdaDetailPage.tsx
│   ├── ActivityPage.tsx
│   └── SettingsPage.tsx
└── types/                 # Project, Surat, Berita, Perjanjian, Nda, Activity, Snapshot, Logo
```

## Fitur Utama

| Tab | Path | Fitur |
|---|---|---|
| Setup Proyek | `/` | List + Create + Edit project. p1/p2 embedded inline. |
| Surat Penawaran | `/surat` | List per-project + items dengan auto-total + preview |
| Berita Acara | `/berita` | Items dengan default 'Sesuai'/'Baik' + preview |
| Perjanjian | `/perjanjian` | 3-level tree editor (pasal/poin/sub) + template Barang/Jasa + preview |
| NDA | `/nda` | Auto-resolved Pihak Pengungkap dari project.p1 + preview |
| Riwayat | `/history` | Activity log dengan filter + stats cards (auto-refresh 30s) |
| Pengaturan | `/settings` | Logo upload (admin only) |

### Document Preview & Print

Setiap detail page punya tab "Preview" yang render dokumen siap cetak:
- Mirror layout Doc Manager.html original (Plus Jakarta Sans + Cormorant Garamond)
- Klik tombol "Cetak" di action bar → browser print dialog dengan preview siap A4
- `@media print` di-config: hide UI, show only `.doc-paper`, `@page A4 1.5cm margin`

### Inline Auto-Save

Items di Surat/Berita dan poin/sub-poin di Perjanjian pakai pattern:
- User mengetik di textarea/input
- Local state update instant
- Debounce 800ms via `useDebouncedText` hook
- API PATCH ter-fire saat user diam → backend audit log granular

### Snapshot & Restore

`SnapshotsPanel` polymorphic dipasang di 5 detail pages. Hash SHA256
ditampilkan untuk integrity verification. Restore confirmation via
AlertDialog.

## Build & Deploy

```bash
# Type-check + production build
bun run build
# Output: dist/ — ~10 chunks code-split per route

# Preview production build
bun preview
```

Bundle size:
- Initial: **105 KB gzipped** (login + shell + react/router/query)
- Per-page chunks: 0.4–6 KB gzipped each
- Vendor chunks (card, dialog, select): 47/12/17 KB shared

### Deploy Static Hosting

`bun run build` menghasilkan `dist/` siap deploy ke Vercel, Netlify,
Cloudflare Pages, S3+CloudFront, dll. Pastikan:

1. Set `VITE_API_URL=https://api.your-domain.com/api/v1` di env build
2. Backend CORS env: `CORS_ALLOWED_ORIGINS=https://your-frontend.com`
3. SPA fallback rewrite — semua route `/*` → `/index.html`

## Pattern Reuseable

### Auto-save inline editing
```tsx
const [value, setValue] = useDebouncedText(item.text, async (v) => {
  await updateMutation.mutateAsync({ id: item.id, text: v })
})

<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

### Permission-aware UI
```tsx
const { data: user } = useCurrentUser()
const canCreate = hasPermission(user, 'surat.create')

{canCreate && <Button>Buat Surat</Button>}
```

### Polymorphic snapshot panel
```tsx
<SnapshotsPanel type="perjanjian" id={perjanjian.id} entityLabel="perjanjian" />
```

### Document preview wrapper
```tsx
<DocPaper>
  {/* JSX dengan Tailwind kelas, hex colors literal untuk print */}
</DocPaper>
```

## Troubleshooting

**Path alias `@/...` not found**: cek `tsconfig.app.json` punya
`paths: { "@/*": ["./src/*"] }` dan `vite.config.ts` punya
`alias: { '@': path.resolve(__dirname, './src') }`.

**"Network Error" saat login dev**: backend belum running di port 8765,
atau Vite proxy salah konfigurasi (lihat `vite.config.ts`).

**Logo gambar tidak muncul setelah upload**: cek backend `php artisan storage:link`
sudah jalan. Atau Vite proxy `/storage` belum forward.

**Print preview kosong**: pastikan ada di tab "Preview" sebelum klik
Cetak (atau pakai tombol Print di DocActionsBar yang auto-render via
print-only div).

## Stack Decisions

Lihat `../backend_plan.md` (di parent dir) untuk semua keputusan
arsitektur. Highlight:

- **D2 SPA**: Migrate dari single-file HTML → React SPA di fase 2
- **D4 PDF client-side**: window.print() — backend hanya log event
- **D5 Pasal tabel relasional**: pasal/poin/sub_poin sebagai 3 tabel
- **TypeScript wajib**: shadcn copy TSX components, lebih native dengan TS
