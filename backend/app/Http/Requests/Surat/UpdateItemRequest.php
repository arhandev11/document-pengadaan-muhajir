<?php

namespace App\Http\Requests\Surat;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('surat.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nama' => ['sometimes', 'nullable', 'string', 'max:500'],
            'spesifikasi' => ['sometimes', 'nullable', 'string', 'max:500'],
            'jumlah' => ['sometimes', 'nullable', 'string', 'max:100'],
            'harga_satuan' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
