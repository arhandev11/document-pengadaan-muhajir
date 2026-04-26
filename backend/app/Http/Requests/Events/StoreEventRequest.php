<?php

namespace App\Http\Requests\Events;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Per-action permission dicek di controller (PRINT bebas, EXPORT_* butuh perm).
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'in:PRINT,EXPORT_PDF,EXPORT_HTML,EXPORT_JSON'],
            'subject_type' => ['required', 'in:project,surat,berita,perjanjian,nda'],
            'subject_id' => ['required', 'integer', 'min:1'],
            'note' => ['nullable', 'string', 'max:500'],
        ];
    }
}
