<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Events\StoreEventRequest;
use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\SuratPenawaran;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    private const SUBJECT_MAP = [
        'project' => Project::class,
        'surat' => SuratPenawaran::class,
        'berita' => BeritaAcara::class,
        'perjanjian' => Perjanjian::class,
        'nda' => Nda::class,
    ];

    private const ACTION_PERMISSION = [
        'PRINT' => null, // no permission — asumsi user yang bisa view bisa print
        'EXPORT_PDF' => 'export.pdf',
        'EXPORT_HTML' => 'export.html',
        'EXPORT_JSON' => 'export.json',
    ];

    private const ACTION_DESCRIPTION = [
        'PRINT' => 'Dokumen dicetak',
        'EXPORT_PDF' => 'Dokumen diekspor ke PDF',
        'EXPORT_HTML' => 'Dokumen diekspor ke HTML',
        'EXPORT_JSON' => 'Dokumen diekspor ke JSON',
    ];

    /**
     * POST /api/v1/events
     * Frontend memanggil ini saat user klik Print / Save PDF / Save HTML /
     * Save JSON. Backend hanya menulis activity log — tidak generate file
     * (file dihasilkan di client, per D4 keputusan user).
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        $user = $request->user();
        $action = $request->validated('action');
        $subjectType = $request->validated('subject_type');
        $subjectId = $request->validated('subject_id');

        // Permission check per-action
        $perm = self::ACTION_PERMISSION[$action] ?? null;
        if ($perm !== null) {
            $user->can($perm) ?: abort(403, "Tidak memiliki permission: {$perm}");
        }

        // Resolve subject model
        $class = self::SUBJECT_MAP[$subjectType];
        $subject = $class::findOrFail($subjectId);

        // Permission baseline: user harus bisa view dokumen ini
        $user->can("{$subjectType}.view") ?: abort(403);

        $description = self::ACTION_DESCRIPTION[$action];
        if ($note = $request->validated('note')) {
            $description .= ' — ' . $note;
        }

        $activity = activity('event')
            ->performedOn($subject)
            ->causedBy($user)
            ->event($action)
            ->withProperties([
                'note' => $note,
                'user_agent' => $request->userAgent(),
                'ip' => $request->ip(),
            ])
            ->log($description);

        return response()->json([
            'message' => 'Event tercatat.',
            'activity_id' => $activity?->id,
        ], 201);
    }
}
