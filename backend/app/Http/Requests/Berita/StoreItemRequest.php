<?php

namespace App\Http\Requests\Berita;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('berita.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nama' => ['nullable', 'string', 'max:500'],
            'jumlah' => ['nullable', 'string', 'max:100'],
            'spesifikasi' => ['nullable', 'string', 'max:200'],
            'kondisi' => ['nullable', 'string', 'max:100'],
        ];
    }
}
