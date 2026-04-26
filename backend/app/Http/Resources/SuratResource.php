<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\SuratPenawaran
 */
class SuratResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $items = $this->whenLoaded('items');
        $grandTotal = $this->relationLoaded('items')
            ? $this->items->sum(fn ($item) => $item->total)
            : null;

        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'nomor' => $this->nomor,
            'tanggal' => $this->tanggal,
            'perihal' => $this->perihal,
            'nama_program' => $this->nama_program,
            'garansi' => $this->garansi,
            'waktu_kirim' => $this->waktu_kirim,
            'masa_berlaku' => $this->masa_berlaku,
            'items' => SuratItemResource::collection($items),
            'grand_total' => $grandTotal,
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
