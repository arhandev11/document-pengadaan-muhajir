<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \Spatie\Activitylog\Models\Activity
 */
class ActivityResource extends JsonResource
{
    /**
     * Mapping log_name Spatie → doc_type untuk UX (menggabungkan child logs
     * ke parent doc type). Contoh: log_name "pasal"/"poin"/"sub-poin" semua
     * dianggap aktivitas terhadap "perjanjian".
     */
    private const LOG_NAME_TO_DOC = [
        'project' => 'project',
        'surat' => 'surat',
        'surat-item' => 'surat',
        'berita' => 'berita',
        'berita-item' => 'berita',
        'perjanjian' => 'perjanjian',
        'pasal' => 'perjanjian',
        'poin' => 'perjanjian',
        'sub-poin' => 'perjanjian',
        'nda' => 'nda',
    ];

    /**
     * Normalisasi event Spatie ke action label sesuai konvensi frontend PRD §7.2.
     */
    private const EVENT_TO_ACTION = [
        'created' => 'CREATE',
        'updated' => 'EDIT',
        'deleted' => 'DELETE',
        'restored' => 'RESTORE',
    ];

    public function toArray(Request $request): array
    {
        $docType = self::LOG_NAME_TO_DOC[$this->log_name] ?? $this->log_name;
        $action = self::EVENT_TO_ACTION[$this->event] ?? strtoupper((string) $this->event);

        return [
            'id' => $this->id,
            'log_name' => $this->log_name,
            'doc_type' => $docType,
            'event' => $this->event,
            'action' => $action,
            'description' => $this->description,
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'causer' => $this->whenLoaded('causer', fn () => $this->causer ? [
                'id' => $this->causer->id,
                'name' => $this->causer->name,
            ] : null),
            'changes' => $this->attribute_changes?->toArray(),
            'properties' => $this->properties?->toArray(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
