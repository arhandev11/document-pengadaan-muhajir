<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Snapshot
 */
class SnapshotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'snapshotable_type' => $this->snapshotable_type,
            'snapshotable_id' => $this->snapshotable_id,
            'label' => $this->label,
            'data_hash' => $this->data_hash,
            // Data hanya dikeluarkan saat GET single snapshot (opt-in via `?with_data=1`
            // atau detail endpoint), bukan di list — bisa besar untuk Perjanjian.
            'data' => $this->when($request->boolean('with_data') || $request->routeIs('snapshots.show'), $this->data),
            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
