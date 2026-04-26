<?php

namespace App\Http\Requests\Projects;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'p1_nama' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p1_jabatan' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p1_perusahaan' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p1_alamat' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'p2_nama' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p2_jabatan' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p2_organisasi' => ['sometimes', 'nullable', 'string', 'max:255'],
            'p2_alamat' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'nomor_spk' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tanggal_spk' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
