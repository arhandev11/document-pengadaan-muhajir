<?php

namespace App\Http\Requests\Berita;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('berita.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nama' => ['sometimes', 'nullable', 'string', 'max:500'],
            'jumlah' => ['sometimes', 'nullable', 'string', 'max:100'],
            'spesifikasi' => ['sometimes', 'nullable', 'string', 'max:200'],
            'kondisi' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
