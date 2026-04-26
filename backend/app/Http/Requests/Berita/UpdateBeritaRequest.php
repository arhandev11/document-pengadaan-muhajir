<?php

namespace App\Http\Requests\Berita;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBeritaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('berita.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['sometimes', 'nullable', 'string', 'max:100'],
            'hari' => ['sometimes', 'nullable', 'string', 'max:30'],
            'tanggal' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tempat' => ['sometimes', 'nullable', 'string', 'max:100'],
            'nama_kegiatan' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'tempat_buat' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tanggal_buat' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
