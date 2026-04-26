<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Poin extends Model implements Sortable
{
    use HasFactory;
    use LogsActivity;
    use SortableTrait;

    protected $table = 'poin';

    protected $fillable = [
        'pasal_id',
        'order_column',
        'text',
    ];

    public array $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    public function pasal(): BelongsTo
    {
        return $this->belongsTo(Pasal::class);
    }

    public function subPoin(): HasMany
    {
        return $this->hasMany(SubPoin::class)->orderBy('order_column');
    }

    public function buildSortQuery()
    {
        return static::query()->where('pasal_id', $this->pasal_id);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('poin')
            ->setDescriptionForEvent(fn (string $eventName) => "Poin {$eventName}");
    }
}
