<?php

namespace App\Http\Requests\Surat;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('surat.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nama' => ['nullable', 'string', 'max:500'],
            'spesifikasi' => ['nullable', 'string', 'max:500'],
            'jumlah' => ['nullable', 'string', 'max:100'],
            'harga_satuan' => ['nullable', 'string', 'max:100'],
        ];
    }
}
