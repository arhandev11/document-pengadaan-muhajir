<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Surat\ReorderItemsRequest;
use App\Http\Requests\Surat\StoreItemRequest;
use App\Http\Requests\Surat\UpdateItemRequest;
use App\Http\Resources\SuratItemResource;
use App\Models\SuratPenawaran;
use App\Models\SuratPenawaranItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SuratItemController extends Controller
{
    public function store(StoreItemRequest $request, SuratPenawaran $surat): JsonResponse
    {
        $item = $surat->items()->create($request->validated());

        return (new SuratItemResource($item))->response()->setStatusCode(201);
    }

    public function update(UpdateItemRequest $request, SuratPenawaranItem $item): SuratItemResource
    {
        $item->update($request->validated());

        return new SuratItemResource($item);
    }

    public function destroy(Request $request, SuratPenawaranItem $item): JsonResponse
    {
        $request->user()->can('surat.update') ?: abort(403);

        $item->delete();

        return response()->json(['message' => 'Item dihapus.']);
    }

    /**
     * Reorder items secara batch. Body: {ids: [3, 1, 2, 4]} → order_column
     * akan di-set sesuai indeks array ini, dalam satu transaksi.
     */
    public function reorder(ReorderItemsRequest $request, SuratPenawaran $surat): JsonResponse
    {
        $ids = $request->validated('ids');

        // Guard: semua id harus milik surat yang sama (hindari cross-surat reorder)
        $countOwned = $surat->items()->whereIn('id', $ids)->count();
        abort_if($countOwned !== count($ids), 422, 'Beberapa item bukan milik surat ini.');

        SuratPenawaranItem::setNewOrder($ids);

        return response()->json([
            'message' => 'Urutan diperbarui.',
            'ids' => $ids,
        ]);
    }
}
