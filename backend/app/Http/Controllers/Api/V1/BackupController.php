<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\Snapshot;
use App\Models\SuratPenawaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class BackupController extends Controller
{
    /**
     * GET /api/v1/backup/full
     * Mengembalikan JSON lengkap seluruh data — project, 4 dokumen,
     * snapshots, activity logs. Menutup gap PRD §15.11.
     *
     * Permission: export.json (admin & editor & viewer semua bisa).
     * Untuk dokumen legal dengan banyak data, rekomendasi gunakan via
     * download header (application/json + attachment) — client simpan .json
     * file langsung.
     */
    public function full(Request $request): JsonResponse
    {
        $request->user()->can('export.json') ?: abort(403);

        $data = [
            'metadata' => [
                'exported_at' => now()->toIso8601String(),
                'exported_by' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ],
                'version' => '3.0', // naik dari v2.0 frontend — schema sudah berbeda (relational)
                'source' => 'doc-manager-backend',
            ],
            'projects' => Project::query()
                ->with(['creator:id,name'])
                ->get()
                ->toArray(),
            'surat_penawaran' => SuratPenawaran::query()
                ->with(['items', 'creator:id,name'])
                ->get()
                ->toArray(),
            'berita_acara' => BeritaAcara::query()
                ->with(['items', 'creator:id,name'])
                ->get()
                ->toArray(),
            'perjanjian' => Perjanjian::query()
                ->with(['pasal.poin.subPoin', 'creator:id,name'])
                ->get()
                ->toArray(),
            'nda' => Nda::query()
                ->with(['project', 'creator:id,name'])
                ->get()
                ->toArray(),
            'snapshots' => Snapshot::query()
                ->with('creator:id,name')
                ->get()
                ->toArray(),
            'activity_log' => Activity::query()
                ->with('causer:id,name')
                ->get()
                ->toArray(),
        ];

        $counts = [
            'projects' => count($data['projects']),
            'surat_penawaran' => count($data['surat_penawaran']),
            'berita_acara' => count($data['berita_acara']),
            'perjanjian' => count($data['perjanjian']),
            'nda' => count($data['nda']),
            'snapshots' => count($data['snapshots']),
            'activity_log' => count($data['activity_log']),
        ];
        $data['metadata']['counts'] = $counts;

        $filename = 'doc-manager-backup-'.now()->format('Y-m-d-His').'.json';

        return response()->json($data)
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
