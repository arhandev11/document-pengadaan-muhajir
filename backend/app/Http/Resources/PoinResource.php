<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Poin
 */
class PoinResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pasal_id' => $this->pasal_id,
            'order_column' => $this->order_column,
            'text' => $this->text,
            'sub' => SubPoinResource::collection($this->whenLoaded('subPoin')),
        ];
    }
}
