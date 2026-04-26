<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\SuratPenawaranItem
 */
class SuratItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'surat_penawaran_id' => $this->surat_penawaran_id,
            'order_column' => $this->order_column,
            'nama' => $this->nama,
            'spesifikasi' => $this->spesifikasi,
            'jumlah' => $this->jumlah,
            'harga_satuan' => $this->harga_satuan,
            'total' => $this->total,
        ];
    }
}
