<?php

namespace App\Models\Concerns;

use App\Models\Snapshot;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasSnapshots
{
    public function snapshots(): MorphMany
    {
        return $this->morphMany(Snapshot::class, 'snapshotable')->latest('id');
    }
}
