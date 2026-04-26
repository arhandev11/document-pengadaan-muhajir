<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Berita\ReorderItemsRequest;
use App\Http\Requests\Berita\StoreItemRequest;
use App\Http\Requests\Berita\UpdateItemRequest;
use App\Http\Resources\BeritaItemResource;
use App\Models\BeritaAcara;
use App\Models\BeritaAcaraItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BeritaItemController extends Controller
{
    public function store(StoreItemRequest $request, BeritaAcara $berita): JsonResponse
    {
        $item = $berita->items()->create($request->validated());

        return (new BeritaItemResource($item))->response()->setStatusCode(201);
    }

    public function update(UpdateItemRequest $request, BeritaAcaraItem $item): BeritaItemResource
    {
        $item->update($request->validated());

        return new BeritaItemResource($item);
    }

    public function destroy(Request $request, BeritaAcaraItem $item): JsonResponse
    {
        $request->user()->can('berita.update') ?: abort(403);

        $item->delete();

        return response()->json(['message' => 'Item dihapus.']);
    }

    public function reorder(ReorderItemsRequest $request, BeritaAcara $berita): JsonResponse
    {
        $ids = $request->validated('ids');

        $countOwned = $berita->items()->whereIn('id', $ids)->count();
        abort_if($countOwned !== count($ids), 422, 'Beberapa item bukan milik berita ini.');

        BeritaAcaraItem::setNewOrder($ids);

        return response()->json([
            'message' => 'Urutan diperbarui.',
            'ids' => $ids,
        ]);
    }
}
