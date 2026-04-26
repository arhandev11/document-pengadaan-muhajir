<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Perjanjian\ReorderSubPoinRequest;
use App\Http\Requests\Perjanjian\StoreSubPoinRequest;
use App\Http\Requests\Perjanjian\UpdateSubPoinRequest;
use App\Http\Resources\SubPoinResource;
use App\Models\Poin;
use App\Models\SubPoin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubPoinController extends Controller
{
    public function store(StoreSubPoinRequest $request, Poin $poin): JsonResponse
    {
        $sub = $poin->subPoin()->create($request->validated());

        return (new SubPoinResource($sub))
            ->response()->setStatusCode(201);
    }

    public function update(UpdateSubPoinRequest $request, SubPoin $subPoin): SubPoinResource
    {
        $subPoin->update($request->validated());

        return new SubPoinResource($subPoin);
    }

    public function destroy(Request $request, SubPoin $subPoin): JsonResponse
    {
        $request->user()->can('perjanjian.update') ?: abort(403);

        $subPoin->delete();

        return response()->json(['message' => 'Sub-poin dihapus.']);
    }

    public function reorder(ReorderSubPoinRequest $request, Poin $poin): JsonResponse
    {
        $ids = $request->validated('ids');

        $countOwned = $poin->subPoin()->whereIn('id', $ids)->count();
        abort_if($countOwned !== count($ids), 422, 'Beberapa sub-poin bukan milik poin ini.');

        SubPoin::setNewOrder($ids);

        return response()->json(['message' => 'Urutan sub-poin diperbarui.', 'ids' => $ids]);
    }
}
