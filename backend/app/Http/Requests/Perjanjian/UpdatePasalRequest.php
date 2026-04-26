<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'judul' => ['sometimes', 'nullable', 'string', 'max:255'],
            'intro' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}
