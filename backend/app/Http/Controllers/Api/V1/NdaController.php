<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Nda\StoreNdaRequest;
use App\Http\Requests\Nda\UpdateNdaRequest;
use App\Http\Resources\NdaResource;
use App\Models\Nda;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NdaController extends Controller
{
    public function index(Request $request, Project $project): AnonymousResourceCollection
    {
        $request->user()->can('nda.view') ?: abort(403);

        $nda = $project->nda()
            ->with(['project', 'creator:id,name'])
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return NdaResource::collection($nda);
    }

    public function store(StoreNdaRequest $request, Project $project): JsonResponse
    {
        $nda = $project->nda()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        return (new NdaResource($nda->load(['project', 'creator:id,name'])))
            ->response()->setStatusCode(201);
    }

    public function show(Request $request, Nda $nda): NdaResource
    {
        $request->user()->can('nda.view') ?: abort(403);

        return new NdaResource($nda->load(['project', 'creator:id,name']));
    }

    public function update(UpdateNdaRequest $request, Nda $nda): NdaResource
    {
        $nda->update($request->validated());

        return new NdaResource($nda->load(['project', 'creator:id,name']));
    }

    public function destroy(Request $request, Nda $nda): JsonResponse
    {
        $request->user()->can('nda.delete') ?: abort(403);

        $nda->delete();

        return response()->json(['message' => 'NDA dihapus.']);
    }
}
