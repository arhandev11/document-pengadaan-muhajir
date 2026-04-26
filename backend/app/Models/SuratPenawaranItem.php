<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class SuratPenawaranItem extends Model implements Sortable
{
    use HasFactory;
    use LogsActivity;
    use SortableTrait;

    protected $table = 'surat_penawaran_items';

    protected $fillable = [
        'surat_penawaran_id',
        'nama',
        'spesifikasi',
        'jumlah',
        'harga_satuan',
        'order_column',
    ];

    public array $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    public function surat(): BelongsTo
    {
        return $this->belongsTo(SuratPenawaran::class, 'surat_penawaran_id');
    }

    /**
     * Scope sortable siblings agar order_column unik per surat (bukan global).
     */
    public function buildSortQuery()
    {
        return static::query()->where('surat_penawaran_id', $this->surat_penawaran_id);
    }

    /**
     * Total terkomputasi mengikuti frontend autoTotal(it) = toNum(jumlah) * toNum(hargaSatuan).
     */
    public function getTotalAttribute(): int
    {
        return $this->toNum($this->jumlah) * $this->toNum($this->harga_satuan);
    }

    private function toNum(?string $value): int
    {
        return (int) preg_replace('/\D/', '', (string) $value);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logFillable()
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('surat-item')
            ->setDescriptionForEvent(fn (string $eventName) => "Surat item {$eventName}");
    }
}
