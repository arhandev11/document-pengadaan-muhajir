<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Berita\StoreBeritaRequest;
use App\Http\Requests\Berita\UpdateBeritaRequest;
use App\Http\Resources\BeritaResource;
use App\Models\BeritaAcara;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class BeritaController extends Controller
{
    public function index(Request $request, Project $project): AnonymousResourceCollection
    {
        $request->user()->can('berita.view') ?: abort(403);

        $berita = $project->beritaAcara()
            ->with(['items', 'creator:id,name'])
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return BeritaResource::collection($berita);
    }

    public function store(StoreBeritaRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        $itemsData = $data['items'] ?? [];
        unset($data['items']);

        $berita = DB::transaction(function () use ($project, $data, $itemsData, $request) {
            $berita = $project->beritaAcara()->create([
                ...$data,
                'created_by' => $request->user()->id,
            ]);

            foreach ($itemsData as $item) {
                $berita->items()->create($item);
            }

            return $berita;
        });

        return (new BeritaResource($berita->load(['items', 'creator:id,name'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, BeritaAcara $berita): BeritaResource
    {
        $request->user()->can('berita.view') ?: abort(403);

        return new BeritaResource($berita->load(['items', 'creator:id,name']));
    }

    public function update(UpdateBeritaRequest $request, BeritaAcara $berita): BeritaResource
    {
        $berita->update($request->validated());

        return new BeritaResource($berita->load(['items', 'creator:id,name']));
    }

    public function destroy(Request $request, BeritaAcara $berita): JsonResponse
    {
        $request->user()->can('berita.delete') ?: abort(403);

        $berita->delete();

        return response()->json(['message' => 'Berita Acara dihapus.']);
    }
}
