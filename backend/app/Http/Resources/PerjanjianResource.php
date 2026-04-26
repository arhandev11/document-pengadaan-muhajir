<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Perjanjian
 */
class PerjanjianResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'tipe' => $this->tipe,
            'nomor' => $this->nomor,
            'judul' => $this->judul,
            'tanggal' => $this->tanggal,
            'tempat' => $this->tempat,
            'hari_ttd' => $this->hari_ttd,
            'konsideran' => $this->konsideran,
            'pasal' => PasalResource::collection($this->whenLoaded('pasal')),
            'pasal_count' => $this->whenCounted('pasal'),
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
