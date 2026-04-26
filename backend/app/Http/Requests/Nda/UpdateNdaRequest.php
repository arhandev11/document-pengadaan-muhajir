<?php

namespace App\Http\Requests\Nda;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNdaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('nda.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['sometimes', 'nullable', 'string', 'max:100'],
            'hari' => ['sometimes', 'nullable', 'string', 'max:30'],
            'tanggal' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tempat' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pn_nama' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pn_ktp' => ['sometimes', 'nullable', 'string', 'max:30'],
            'pn_alamat' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'pn_jabatan' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pn_organisasi' => ['sometimes', 'nullable', 'string', 'max:255'],
            'pn_nomor_kontrak' => ['sometimes', 'nullable', 'string', 'max:100'],
            'pn_tanggal_kontrak' => ['sometimes', 'nullable', 'string', 'max:100'],
            'konteks_pelaksanaan' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'jenis_dukungan' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'objek_kegiatan' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'objek_informasi' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'jangka_waktu' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }
}
