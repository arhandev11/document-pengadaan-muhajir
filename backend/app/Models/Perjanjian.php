<?php

namespace App\Models;

use App\Models\Concerns\HasSnapshots;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Perjanjian extends Model
{
    use HasFactory;
    use HasSnapshots;
    use LogsActivity;
    use SoftDeletes;

    protected $table = 'perjanjian';

    protected $fillable = [
        'project_id',
        'tipe',
        'nomor',
        'judul',
        'tanggal',
        'tempat',
        'hari_ttd',
        'konsideran',
        'created_by',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function pasal(): HasMany
    {
        return $this->hasMany(Pasal::class)->orderBy('order_column');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('perjanjian')
            ->setDescriptionForEvent(fn (string $eventName) => "Perjanjian {$eventName}");
    }
}
