<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\BeritaAcara
 */
class BeritaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'nomor' => $this->nomor,
            'hari' => $this->hari,
            'tanggal' => $this->tanggal,
            'tempat' => $this->tempat,
            'nama_kegiatan' => $this->nama_kegiatan,
            'tempat_buat' => $this->tempat_buat,
            'tanggal_buat' => $this->tanggal_buat,
            'items' => BeritaItemResource::collection($this->whenLoaded('items')),
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
