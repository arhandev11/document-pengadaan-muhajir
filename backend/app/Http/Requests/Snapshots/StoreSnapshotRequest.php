<?php

namespace App\Http\Requests\Snapshots;

use Illuminate\Foundation\Http\FormRequest;

class StoreSnapshotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('snapshot.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'label' => ['nullable', 'string', 'max:255'],
        ];
    }
}
