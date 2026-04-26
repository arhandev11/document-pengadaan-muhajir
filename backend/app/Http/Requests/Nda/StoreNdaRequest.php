<?php

namespace App\Http\Requests\Nda;

use Illuminate\Foundation\Http\FormRequest;

class StoreNdaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('nda.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'nomor' => ['nullable', 'string', 'max:100'],
            'hari' => ['nullable', 'string', 'max:30'],
            'tanggal' => ['nullable', 'string', 'max:100'],
            'tempat' => ['nullable', 'string', 'max:100'],
            'pn_nama' => ['nullable', 'string', 'max:255'],
            'pn_ktp' => ['nullable', 'string', 'max:30'],
            'pn_alamat' => ['nullable', 'string', 'max:2000'],
            'pn_jabatan' => ['nullable', 'string', 'max:255'],
            'pn_organisasi' => ['nullable', 'string', 'max:255'],
            'pn_nomor_kontrak' => ['nullable', 'string', 'max:100'],
            'pn_tanggal_kontrak' => ['nullable', 'string', 'max:100'],
            'konteks_pelaksanaan' => ['nullable', 'string', 'max:5000'],
            'jenis_dukungan' => ['nullable', 'string', 'max:5000'],
            'objek_kegiatan' => ['nullable', 'string', 'max:5000'],
            'objek_informasi' => ['nullable', 'string', 'max:5000'],
            'jangka_waktu' => ['nullable', 'string', 'max:100'],
        ];
    }
}
