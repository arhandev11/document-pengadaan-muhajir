<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class StorePerjanjianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'tipe' => ['required', 'in:barang,jasa'],
            'nomor' => ['nullable', 'string', 'max:100'],
            'judul' => ['nullable', 'string', 'max:255'],
            'tanggal' => ['nullable', 'string', 'max:100'],
            'tempat' => ['nullable', 'string', 'max:100'],
            'hari_ttd' => ['nullable', 'string', 'max:30'],
            'konsideran' => ['nullable', 'string', 'max:5000'],
            'use_template' => ['boolean'],
        ];
    }
}
