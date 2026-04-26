<?php

namespace App\Http\Requests\Perjanjian;

use Illuminate\Foundation\Http\FormRequest;

class ReorderSubPoinRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('perjanjian.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:sub_poin,id'],
        ];
    }
}
