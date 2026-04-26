<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Activitylog\Models\Activity;

class ActivityController extends Controller
{
    /**
     * Mapping doc_type frontend → log_name backend (reverse dari ActivityResource).
     * Satu doc_type bisa cover banyak log_name (mis. perjanjian = pasal+poin+sub-poin).
     */
    private const DOC_TO_LOG_NAMES = [
        'project' => ['project'],
        'surat' => ['surat', 'surat-item'],
        'berita' => ['berita', 'berita-item'],
        'perjanjian' => ['perjanjian', 'pasal', 'poin', 'sub-poin'],
        'nda' => ['nda'],
    ];

    /**
     * GET /api/v1/activity
     * Query params:
     *   - doc_type    : project|surat|berita|perjanjian|nda (broad filter)
     *   - log_name    : filter exact log_name
     *   - event       : created|updated|deleted|restored
     *   - subject_id  : filter by specific entity id
     *   - causer_id   : filter by user
     *   - date_from   : ISO date
     *   - date_to     : ISO date
     *   - per_page    : default 20
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->user()->can('activity.view') ?: abort(403);

        $query = Activity::query()->with('causer:id,name');

        if ($docType = $request->string('doc_type')->value()) {
            $logNames = self::DOC_TO_LOG_NAMES[$docType] ?? [$docType];
            $query->whereIn('log_name', $logNames);
        }

        if ($logName = $request->string('log_name')->value()) {
            $query->where('log_name', $logName);
        }

        if ($event = $request->string('event')->value()) {
            $query->where('event', $event);
        }

        if ($subjectId = $request->integer('subject_id')) {
            $query->where('subject_id', $subjectId);
        }

        if ($causerId = $request->integer('causer_id')) {
            $query->where('causer_id', $causerId);
        }

        if ($dateFrom = $request->date('date_from')) {
            $query->where('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->date('date_to')) {
            $query->where('created_at', '<=', $dateTo->endOfDay());
        }

        $activities = $query->latest('id')->paginate($request->integer('per_page', 20));

        return ActivityResource::collection($activities);
    }

    /**
     * GET /api/v1/activity/stats
     * Mengembalikan statistik untuk stat cards & badge di history page
     * (setara renderHistoryStats() di frontend).
     */
    public function stats(Request $request): JsonResponse
    {
        $request->user()->can('activity.view') ?: abort(403);

        $base = Activity::query();

        $total = (clone $base)->count();
        $recent1h = (clone $base)->where('created_at', '>=', now()->subHour())->count();
        $recent24h = (clone $base)->where('created_at', '>=', now()->subDay())->count();

        // Hitung per event (setelah dimapping ke action)
        $byEventRaw = (clone $base)
            ->selectRaw('event, COUNT(*) as cnt')
            ->groupBy('event')
            ->pluck('cnt', 'event')
            ->all();

        $byAction = [];
        foreach ($byEventRaw as $event => $cnt) {
            $action = match ($event) {
                'created' => 'CREATE',
                'updated' => 'EDIT',
                'deleted' => 'DELETE',
                'restored' => 'RESTORE',
                default => strtoupper((string) $event),
            };
            $byAction[$action] = ($byAction[$action] ?? 0) + $cnt;
        }

        // Hitung per doc_type (agregasi dari log_name)
        $byLogName = (clone $base)
            ->selectRaw('log_name, COUNT(*) as cnt')
            ->groupBy('log_name')
            ->pluck('cnt', 'log_name')
            ->all();

        $byDocType = [
            'project' => 0,
            'surat' => 0,
            'berita' => 0,
            'perjanjian' => 0,
            'nda' => 0,
        ];
        foreach ($byLogName as $logName => $cnt) {
            $docType = match ($logName) {
                'project' => 'project',
                'surat', 'surat-item' => 'surat',
                'berita', 'berita-item' => 'berita',
                'perjanjian', 'pasal', 'poin', 'sub-poin' => 'perjanjian',
                'nda' => 'nda',
                default => null,
            };
            if ($docType) {
                $byDocType[$docType] += $cnt;
            }
        }

        return response()->json([
            'total' => $total,
            'recent_1h' => $recent1h,   // untuk tab-badge frontend
            'recent_24h' => $recent24h,
            'by_action' => $byAction,
            'by_doc_type' => $byDocType,
            'by_log_name' => $byLogName,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $request->user()->can('activity.delete') ?: abort(403);

        $log = Activity::findOrFail($id);
        $log->delete();

        return response()->json(['message' => 'Entri aktivitas dihapus.']);
    }

    /**
     * DELETE /api/v1/activity — hapus SEMUA log.
     * Mirror tombol "Hapus Semua" di frontend. Hanya admin.
     */
    public function clear(Request $request): JsonResponse
    {
        $request->user()->can('activity.delete') ?: abort(403);

        $count = Activity::query()->delete();

        return response()->json([
            'message' => "Berhasil menghapus {$count} entri aktivitas.",
            'deleted' => $count,
        ]);
    }
}
