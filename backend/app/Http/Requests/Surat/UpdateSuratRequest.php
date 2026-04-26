<?php

namespace App\Http\Requests\Surat;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('surat.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tanggal' => ['sometimes', 'nullable', 'string', 'max:100'],
            'perihal' => ['sometimes', 'nullable', 'string', 'max:500'],
            'nama_program' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'garansi' => ['sometimes', 'nullable', 'string', 'max:255'],
            'waktu_kirim' => ['sometimes', 'nullable', 'string', 'max:255'],
            'masa_berlaku' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
