<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Pasal
 */
class PasalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'perjanjian_id' => $this->perjanjian_id,
            'order_column' => $this->order_column,
            'judul' => $this->judul,
            'intro' => $this->intro,
            'poin' => PoinResource::collection($this->whenLoaded('poin')),
        ];
    }
}
