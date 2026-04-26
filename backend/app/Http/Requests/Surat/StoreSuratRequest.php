<?php

namespace App\Http\Requests\Surat;

use Illuminate\Foundation\Http\FormRequest;

class StoreSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('surat.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['nullable', 'string', 'max:100'],
            'tanggal' => ['nullable', 'string', 'max:100'],
            'perihal' => ['nullable', 'string', 'max:500'],
            'nama_program' => ['nullable', 'string', 'max:5000'],
            'garansi' => ['nullable', 'string', 'max:255'],
            'waktu_kirim' => ['nullable', 'string', 'max:255'],
            'masa_berlaku' => ['nullable', 'string', 'max:255'],
            'items' => ['sometimes', 'array'],
            'items.*.nama' => ['nullable', 'string', 'max:500'],
            'items.*.spesifikasi' => ['nullable', 'string', 'max:500'],
            'items.*.jumlah' => ['nullable', 'string', 'max:100'],
            'items.*.harga_satuan' => ['nullable', 'string', 'max:100'],
        ];
    }
}
