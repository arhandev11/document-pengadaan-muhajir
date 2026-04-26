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

class BeritaAcara extends Model
{
    use HasFactory;
    use HasSnapshots;
    use LogsActivity;
    use SoftDeletes;

    protected $table = 'berita_acara';

    protected $fillable = [
        'project_id',
        'nomor',
        'hari',
        'tanggal',
        'tempat',
        'nama_kegiatan',
        'tempat_buat',
        'tanggal_buat',
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

    public function items(): HasMany
    {
        return $this->hasMany(BeritaAcaraItem::class)->orderBy('order_column');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('berita')
            ->setDescriptionForEvent(fn (string $eventName) => "Berita Acara {$eventName}");
    }
}
