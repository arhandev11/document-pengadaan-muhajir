<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Snapshots\StoreSnapshotRequest;
use App\Http\Resources\SnapshotResource;
use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\Snapshot;
use App\Models\SuratPenawaran;
use App\Services\SnapshotService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SnapshotController extends Controller
{
    public function __construct(private SnapshotService $service) {}

    private const TYPE_MAP = [
        'projects' => Project::class,
        'surat' => SuratPenawaran::class,
        'berita' => BeritaAcara::class,
        'perjanjian' => Perjanjian::class,
        'nda' => Nda::class,
    ];

    /**
     * List snapshots for a given entity.
     * Route: /api/v1/{type}/{id}/snapshots where {type} = project|surat|berita|perjanjian|nda.
     */
    public function indexFor(Request $request, string $type, int $id): AnonymousResourceCollection
    {
        $request->user()->can('snapshot.create') ?: abort(403);

        $entity = $this->resolveEntity($type, $id);

        $snapshots = $entity->snapshots()
            ->with('creator:id,name')
            ->paginate($request->integer('per_page', 20));

        return SnapshotResource::collection($snapshots);
    }

    public function store(StoreSnapshotRequest $request, string $type, int $id): JsonResponse
    {
        $entity = $this->resolveEntity($type, $id);

        $snapshot = $this->service->capture(
            $entity,
            $request->validated('label'),
            $request->user()->id,
        );

        return (new SnapshotResource($snapshot->load('creator:id,name')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Snapshot $snapshot): SnapshotResource
    {
        $request->user()->can('snapshot.create') ?: abort(403);

        return new SnapshotResource($snapshot->load('creator:id,name'));
    }

    public function restore(Request $request, Snapshot $snapshot): JsonResponse
    {
        $request->user()->can('snapshot.restore') ?: abort(403);

        $entity = $this->service->restore($snapshot);

        return response()->json([
            'message' => 'Data dipulihkan dari snapshot.',
            'snapshot_id' => $snapshot->id,
            'snapshotable_type' => $snapshot->snapshotable_type,
            'snapshotable_id' => $snapshot->snapshotable_id,
            'restored_hash' => $snapshot->data_hash,
        ]);
    }

    public function destroy(Request $request, Snapshot $snapshot): JsonResponse
    {
        $request->user()->can('snapshot.delete') ?: abort(403);

        $snapshot->delete();

        return response()->json(['message' => 'Snapshot dihapus.']);
    }

    private function resolveEntity(string $type, int $id): Model
    {
        $class = self::TYPE_MAP[$type] ?? abort(404, "Unknown snapshot type: {$type}");

        return $class::findOrFail($id);
    }
}
