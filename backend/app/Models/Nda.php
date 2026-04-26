<?php

namespace App\Models;

use App\Models\Concerns\HasSnapshots;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Nda extends Model
{
    use HasFactory;
    use HasSnapshots;
    use LogsActivity;
    use SoftDeletes;

    protected $table = 'nda';

    protected $fillable = [
        'project_id',
        'nomor',
        'hari',
        'tanggal',
        'tempat',
        'pn_nama',
        'pn_ktp',
        'pn_alamat',
        'pn_jabatan',
        'pn_organisasi',
        'pn_nomor_kontrak',
        'pn_tanggal_kontrak',
        'konteks_pelaksanaan',
        'jenis_dukungan',
        'objek_kegiatan',
        'objek_informasi',
        'jangka_waktu',
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

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('nda')
            ->setDescriptionForEvent(fn (string $eventName) => "NDA {$eventName}");
    }
}
