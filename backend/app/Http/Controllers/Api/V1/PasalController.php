<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Perjanjian\ReorderPasalRequest;
use App\Http\Requests\Perjanjian\StorePasalRequest;
use App\Http\Requests\Perjanjian\UpdatePasalRequest;
use App\Http\Resources\PasalResource;
use App\Models\Pasal;
use App\Models\Perjanjian;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PasalController extends Controller
{
    public function store(StorePasalRequest $request, Perjanjian $perjanjian): JsonResponse
    {
        $pasal = $perjanjian->pasal()->create($request->validated());

        return (new PasalResource($pasal->load('poin.subPoin')))
            ->response()->setStatusCode(201);
    }

    public function update(UpdatePasalRequest $request, Pasal $pasal): PasalResource
    {
        $pasal->update($request->validated());

        return new PasalResource($pasal->load('poin.subPoin'));
    }

    public function destroy(Request $request, Pasal $pasal): JsonResponse
    {
        $request->user()->can('perjanjian.update') ?: abort(403);

        $pasal->delete();

        return response()->json(['message' => 'Pasal dihapus.']);
    }

    public function reorder(ReorderPasalRequest $request, Perjanjian $perjanjian): JsonResponse
    {
        $ids = $request->validated('ids');

        $countOwned = $perjanjian->pasal()->whereIn('id', $ids)->count();
        abort_if($countOwned !== count($ids), 422, 'Beberapa pasal bukan milik perjanjian ini.');

        Pasal::setNewOrder($ids);

        return response()->json(['message' => 'Urutan pasal diperbarui.', 'ids' => $ids]);
    }
}
