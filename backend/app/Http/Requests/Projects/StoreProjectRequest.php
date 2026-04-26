<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'p1_nama' => ['nullable', 'string', 'max:255'],
            'p1_jabatan' => ['nullable', 'string', 'max:255'],
            'p1_perusahaan' => ['nullable', 'string', 'max:255'],
            'p1_alamat' => ['nullable', 'string', 'max:2000'],
            'p2_nama' => ['nullable', 'string', 'max:255'],
            'p2_jabatan' => ['nullable', 'string', 'max:255'],
            'p2_organisasi' => ['nullable', 'string', 'max:255'],
            'p2_alamat' => ['nullable', 'string', 'max:2000'],
            'nomor_spk' => ['nullable', 'string', 'max:100'],
            'tanggal_spk' => ['nullable', 'string', 'max:100'],
        ];
    }
}
