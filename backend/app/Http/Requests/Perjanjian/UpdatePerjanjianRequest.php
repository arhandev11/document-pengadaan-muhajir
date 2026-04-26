<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePerjanjianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['sometimes', 'nullable', 'string', 'max:100'],
            'judul' => ['sometimes', 'nullable', 'string', 'max:255'],
            'tanggal' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tempat' => ['sometimes', 'nullable', 'string', 'max:100'],
            'hari_ttd' => ['sometimes', 'nullable', 'string', 'max:30'],
            'konsideran' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}
