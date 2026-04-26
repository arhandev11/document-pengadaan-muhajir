<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Import\LegacyImportRequest;
use App\Services\LegacyImportService;
use Illuminate\Http\JsonResponse;

class ImportController extends Controller
{
    public function __construct(private LegacyImportService $service) {}

    /**
     * POST /api/v1/import/legacy-localstorage
     * Body: seluruh dump dari localStorage frontend lama (kimu_project,
     * kimu_surat, dst). Mengembalikan summary records yang berhasil dibuat.
     */
    public function legacy(LegacyImportRequest $request): JsonResponse
    {
        $projectName = $request->validated('project_name')
            ?: 'Imported from legacy — ' . now()->format('d M Y H:i');

        $summary = $this->service->import(
            $request->all(),
            $projectName,
            $request->user()->id,
        );

        activity('import')
            ->causedBy($request->user())
            ->event('LEGACY_IMPORTED')
            ->withProperties($summary)
            ->log('Import dari localStorage frontend lama');

        return response()->json([
            'message' => 'Import selesai.',
            'summary' => $summary,
        ], 201);
    }
}
