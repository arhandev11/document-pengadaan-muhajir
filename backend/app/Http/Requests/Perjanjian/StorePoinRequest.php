<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class StorePoinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'text' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
