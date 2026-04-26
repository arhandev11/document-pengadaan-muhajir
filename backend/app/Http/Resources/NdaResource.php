<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Nda
 */
class NdaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $project = $this->whenLoaded('project');

        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'nomor' => $this->nomor,
            'hari' => $this->hari,
            'tanggal' => $this->tanggal,
            'tempat' => $this->tempat,

            // Pihak Penerima (individual)
            'pihak_penerima' => [
                'nama' => $this->pn_nama,
                'ktp' => $this->pn_ktp,
                'alamat' => $this->pn_alamat,
                'jabatan' => $this->pn_jabatan,
                'organisasi' => $this->pn_organisasi,
                'nomor_kontrak' => $this->pn_nomor_kontrak,
                'tanggal_kontrak' => $this->pn_tanggal_kontrak,
            ],

            // Pihak Pengungkap — di-resolve dari project.p1 saat relasi di-load
            'pihak_pengungkap' => $project ? [
                'nama' => $project->p1_nama,
                'jabatan' => $project->p1_jabatan,
                'perusahaan' => $project->p1_perusahaan,
                'alamat' => $project->p1_alamat,
            ] : null,

            'konteks_pelaksanaan' => $this->konteks_pelaksanaan,
            'jenis_dukungan' => $this->jenis_dukungan,
            'objek_kegiatan' => $this->objek_kegiatan,
            'objek_informasi' => $this->objek_informasi,
            'jangka_waktu' => $this->jangka_waktu,

            'created_by' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
