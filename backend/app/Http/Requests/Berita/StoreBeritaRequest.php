<?php

namespace App\Http\Requests\Berita;

use Illuminate\Foundation\Http\FormRequest;

class StoreBeritaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('berita.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['nullable', 'string', 'max:100'],
            'hari' => ['nullable', 'string', 'max:30'],
            'tanggal' => ['nullable', 'string', 'max:100'],
            'tempat' => ['nullable', 'string', 'max:100'],
            'nama_kegiatan' => ['nullable', 'string', 'max:5000'],
            'tempat_buat' => ['nullable', 'string', 'max:100'],
            'tanggal_buat' => ['nullable', 'string', 'max:100'],
            'items' => ['sometimes', 'array'],
            'items.*.nama' => ['nullable', 'string', 'max:500'],
            'items.*.jumlah' => ['nullable', 'string', 'max:100'],
            'items.*.spesifikasi' => ['nullable', 'string', 'max:200'],
            'items.*.kondisi' => ['nullable', 'string', 'max:100'],
        ];
    }
}
