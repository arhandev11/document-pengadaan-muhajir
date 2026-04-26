<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Project
 */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'p1' => [
                'nama' => $this->p1_nama,
                'jabatan' => $this->p1_jabatan,
                'perusahaan' => $this->p1_perusahaan,
                'alamat' => $this->p1_alamat,
            ],
            'p2' => [
                'nama' => $this->p2_nama,
                'jabatan' => $this->p2_jabatan,
                'organisasi' => $this->p2_organisasi,
                'alamat' => $this->p2_alamat,
            ],
            'spk' => [
                'nomor' => $this->nomor_spk,
                'tanggal' => $this->tanggal_spk,
            ],
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
