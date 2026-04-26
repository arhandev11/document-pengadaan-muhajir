<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Perjanjian\ResetTemplateRequest;
use App\Http\Requests\Perjanjian\StorePerjanjianRequest;
use App\Http\Requests\Perjanjian\UpdatePerjanjianRequest;
use App\Http\Resources\PerjanjianResource;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Services\PerjanjianService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PerjanjianController extends Controller
{
    public function __construct(private PerjanjianService $service) {}

    public function index(Request $request, Project $project): AnonymousResourceCollection
    {
        $request->user()->can('perjanjian.view') ?: abort(403);

        $perjanjian = $project->perjanjian()
            ->with('creator:id,name')
            ->withCount('pasal')
            ->latest('id')
            ->paginate($request->integer('per_page', 15));

        return PerjanjianResource::collection($perjanjian);
    }

    public function store(StorePerjanjianRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        $useTemplate = $data['use_template'] ?? true;
        unset($data['use_template']);

        $data['judul'] = $data['judul'] ?? ($data['tipe'] === 'jasa'
            ? 'Perjanjian Pengadaan Jasa'
            : 'Perjanjian Pengadaan Barang');

        $perjanjian = $project->perjanjian()->create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        if ($useTemplate) {
            $perjanjian = $this->service->applyTemplate($perjanjian, $data['tipe']);
        }

        return (new PerjanjianResource(
            $perjanjian->load(['pasal.poin.subPoin', 'creator:id,name'])
        ))->response()->setStatusCode(201);
    }

    public function show(Request $request, Perjanjian $perjanjian): PerjanjianResource
    {
        $request->user()->can('perjanjian.view') ?: abort(403);

        return new PerjanjianResource(
            $perjanjian->load(['pasal.poin.subPoin', 'creator:id,name'])
        );
    }

    public function update(UpdatePerjanjianRequest $request, Perjanjian $perjanjian): PerjanjianResource
    {
        $perjanjian->update($request->validated());

        return new PerjanjianResource(
            $perjanjian->load(['pasal.poin.subPoin', 'creator:id,name'])
        );
    }

    public function destroy(Request $request, Perjanjian $perjanjian): JsonResponse
    {
        $request->user()->can('perjanjian.delete') ?: abort(403);

        $perjanjian->delete();

        return response()->json(['message' => 'Perjanjian dihapus.']);
    }

    /**
     * Reset perjanjian ke template default untuk tipe tertentu.
     * Menghapus SEMUA pasal/poin/sub_poin existing.
     */
    public function resetTemplate(ResetTemplateRequest $request, Perjanjian $perjanjian): PerjanjianResource
    {
        $newTipe = $request->validated('tipe');

        $fresh = $this->service->resetTemplate($perjanjian, $newTipe);

        return new PerjanjianResource($fresh->load('creator:id,name'));
    }
}
