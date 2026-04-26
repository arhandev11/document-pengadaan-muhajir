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

class Pasal extends Model implements Sortable
{
    use HasFactory;
    use LogsActivity;
    use SortableTrait;

    protected $table = 'pasal';

    protected $fillable = [
        'perjanjian_id',
        'order_column',
        'judul',
        'intro',
    ];

    public array $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    public function perjanjian(): BelongsTo
    {
        return $this->belongsTo(Perjanjian::class);
    }

    public function poin(): HasMany
    {
        return $this->hasMany(Poin::class)->orderBy('order_column');
    }

    public function buildSortQuery()
    {
        return static::query()->where('perjanjian_id', $this->perjanjian_id);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('pasal')
            ->setDescriptionForEvent(fn (string $eventName) => "Pasal {$eventName}");
    }
}
