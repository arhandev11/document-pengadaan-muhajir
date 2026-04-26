<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Perjanjian\ReorderPoinRequest;
use App\Http\Requests\Perjanjian\StorePoinRequest;
use App\Http\Requests\Perjanjian\UpdatePoinRequest;
use App\Http\Resources\PoinResource;
use App\Models\Pasal;
use App\Models\Poin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PoinController extends Controller
{
    public function store(StorePoinRequest $request, Pasal $pasal): JsonResponse
    {
        $poin = $pasal->poin()->create($request->validated());

        return (new PoinResource($poin->load('subPoin')))
            ->response()->setStatusCode(201);
    }

    public function update(UpdatePoinRequest $request, Poin $poin): PoinResource
    {
        $poin->update($request->validated());

        return new PoinResource($poin->load('subPoin'));
    }

    public function destroy(Request $request, Poin $poin): JsonResponse
    {
        $request->user()->can('perjanjian.update') ?: abort(403);

        $poin->delete();

        return response()->json(['message' => 'Poin dihapus.']);
    }

    public function reorder(ReorderPoinRequest $request, Pasal $pasal): JsonResponse
    {
        $ids = $request->validated('ids');

        $countOwned = $pasal->poin()->whereIn('id', $ids)->count();
        abort_if($countOwned !== count($ids), 422, 'Beberapa poin bukan milik pasal ini.');

        Poin::setNewOrder($ids);

        return response()->json(['message' => 'Urutan poin diperbarui.', 'ids' => $ids]);
    }
}
