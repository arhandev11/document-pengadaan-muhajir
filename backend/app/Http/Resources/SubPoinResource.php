<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\SubPoin
 */
class SubPoinResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'poin_id' => $this->poin_id,
            'order_column' => $this->order_column,
            'text' => $this->text,
        ];
    }
}
