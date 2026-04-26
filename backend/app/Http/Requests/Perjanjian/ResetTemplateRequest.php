<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class ResetTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'tipe' => ['required', 'in:barang,jasa'],
        ];
    }
}
