<?php

namespace App\Http\Requests\Import;

use Illuminate\Foundation\Http\FormRequest;

class LegacyImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('user.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'project_name' => ['nullable', 'string', 'max:255'],

            // Loose validation — biarkan service layer handle transformasi.
            // Frontend shape adalah object/array bebas; tolak kalau bukan array.
            'kimu_project' => ['sometimes', 'array'],
            'kimu_surat' => ['sometimes', 'array'],
            'kimu_berita' => ['sometimes', 'array'],
            'kimu_perjanjian' => ['sometimes', 'array'],
            'kimu_nda' => ['sometimes', 'array'],
            'kimu_snapshots' => ['sometimes', 'array'],

            // Alternative bare keys (tanpa prefix kimu_)
            'project' => ['sometimes', 'array'],
            'surat' => ['sometimes', 'array'],
            'berita' => ['sometimes', 'array'],
            'perjanjian' => ['sometimes', 'array'],
            'nda' => ['sometimes', 'array'],
        ];
    }

    /**
     * Terima dari key apapun — kimu_project atau project — kembalikan yang ada.
     */
    public function dataFor(string $key): ?array
    {
        return $this->input("kimu_{$key}") ?? $this->input($key);
    }
}
