<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Surat\StoreSuratRequest;
use App\Http\Requests\Surat\UpdateSuratRequest;
use App\Http\Resources\SuratResource;
use App\Models\Project;
use App\Models\SuratPenawaran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class SuratController extends Controller
{
    public function index(Request $request, Project $project): AnonymousResourceCollection
    {
        $request->user()->can('surat.view') ?: abort(403);

        $surat = $project->suratPenawaran()
            ->with(['items', 'creator:id,name'])
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return SuratResource::collection($surat);
    }

    public function store(StoreSuratRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        $itemsData = $data['items'] ?? [];
        unset($data['items']);

        $surat = DB::transaction(function () use ($project, $data, $itemsData, $request) {
            $surat = $project->suratPenawaran()->create([
                ...$data,
                'created_by' => $request->user()->id,
            ]);

            foreach ($itemsData as $item) {
                $surat->items()->create($item);
            }

            return $surat;
        });

        return (new SuratResource($surat->load(['items', 'creator:id,name'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, SuratPenawaran $surat): SuratResource
    {
        $request->user()->can('surat.view') ?: abort(403);

        return new SuratResource($surat->load(['items', 'creator:id,name']));
    }

    public function update(UpdateSuratRequest $request, SuratPenawaran $surat): SuratResource
    {
        $surat->update($request->validated());

        return new SuratResource($surat->load(['items', 'creator:id,name']));
    }

    public function destroy(Request $request, SuratPenawaran $surat): JsonResponse
    {
        $request->user()->can('surat.delete') ?: abort(403);

        $surat->delete();

        return response()->json(['message' => 'Surat Penawaran dihapus.']);
    }
}
