<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\BeritaAcaraItem
 */
class BeritaItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'berita_acara_id' => $this->berita_acara_id,
            'order_column' => $this->order_column,
            'nama' => $this->nama,
            'jumlah' => $this->jumlah,
            'spesifikasi' => $this->spesifikasi,
            'kondisi' => $this->kondisi,
        ];
    }
}
