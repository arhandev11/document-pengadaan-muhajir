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

class Project extends Model
{
    use HasFactory;
    use HasSnapshots;
    use LogsActivity;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'p1_nama',
        'p1_jabatan',
        'p1_perusahaan',
        'p1_alamat',
        'p2_nama',
        'p2_jabatan',
        'p2_organisasi',
        'p2_alamat',
        'nomor_spk',
        'tanggal_spk',
        'created_by',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function suratPenawaran(): HasMany
    {
        return $this->hasMany(SuratPenawaran::class);
    }

    public function beritaAcara(): HasMany
    {
        return $this->hasMany(BeritaAcara::class);
    }

    public function perjanjian(): HasMany
    {
        return $this->hasMany(Perjanjian::class);
    }

    public function nda(): HasMany
    {
        return $this->hasMany(Nda::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('project')
            ->setDescriptionForEvent(fn (string $eventName) => "Project {$eventName}");
    }
}
