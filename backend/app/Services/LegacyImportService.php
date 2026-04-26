<?php

namespace App\Services;

use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\SuratPenawaran;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Transformasi dump localStorage frontend (Doc Manager.html) ke schema backend.
 *
 * Konversi: camelCase → snake_case. Shape nested tetap (pasal → poin → sub).
 */
class LegacyImportService
{
    public function import(array $payload, string $projectName, int $userId): array
    {
        return DB::transaction(function () use ($payload, $projectName, $userId) {
            $summary = [
                'project_id' => null,
                'surat_id' => null,
                'surat_items' => 0,
                'berita_id' => null,
                'berita_items' => 0,
                'perjanjian_id' => null,
                'pasal_count' => 0,
                'poin_count' => 0,
                'sub_poin_count' => 0,
                'nda_id' => null,
            ];

            $projectData = $payload['kimu_project'] ?? $payload['project'] ?? [];
            $project = $this->createProject($projectData, $projectName, $userId);
            $summary['project_id'] = $project->id;

            if ($surat = $payload['kimu_surat'] ?? $payload['surat'] ?? null) {
                $result = $this->createSurat($project, $surat, $userId);
                $summary['surat_id'] = $result['id'];
                $summary['surat_items'] = $result['items'];
            }

            if ($berita = $payload['kimu_berita'] ?? $payload['berita'] ?? null) {
                $result = $this->createBerita($project, $berita, $userId);
                $summary['berita_id'] = $result['id'];
                $summary['berita_items'] = $result['items'];
            }

            if ($perj = $payload['kimu_perjanjian'] ?? $payload['perjanjian'] ?? null) {
                $result = $this->createPerjanjian($project, $perj, $userId);
                $summary['perjanjian_id'] = $result['id'];
                $summary['pasal_count'] = $result['pasal'];
                $summary['poin_count'] = $result['poin'];
                $summary['sub_poin_count'] = $result['sub'];
            }

            if ($nda = $payload['kimu_nda'] ?? $payload['nda'] ?? null) {
                $ndaModel = $this->createNda($project, $nda, $userId);
                $summary['nda_id'] = $ndaModel->id;
            }

            return $summary;
        });
    }

    private function createProject(array $data, string $name, int $userId): Project
    {
        return Project::create([
            'name' => $name,
            'p1_nama' => $data['p1Nama'] ?? null,
            'p1_jabatan' => $data['p1Jabatan'] ?? null,
            'p1_perusahaan' => $data['p1Perusahaan'] ?? null,
            'p1_alamat' => $data['p1Alamat'] ?? null,
            'p2_nama' => $data['p2Nama'] ?? null,
            'p2_jabatan' => $data['p2Jabatan'] ?? null,
            'p2_organisasi' => $data['p2Organisasi'] ?? null,
            'p2_alamat' => $data['p2Alamat'] ?? null,
            'nomor_spk' => $data['nomorSPK'] ?? null,
            'tanggal_spk' => $data['tanggalSPK'] ?? null,
            'created_by' => $userId,
        ]);
    }

    private function createSurat(Project $project, array $data, int $userId): array
    {
        $surat = $project->suratPenawaran()->create([
            'nomor' => $data['nomor'] ?? null,
            'tanggal' => $data['tanggal'] ?? null,
            'perihal' => $data['perihal'] ?? null,
            'nama_program' => $data['namaProgram'] ?? null,
            'garansi' => $data['garansi'] ?? null,
            'waktu_kirim' => $data['waktuKirim'] ?? null,
            'masa_berlaku' => $data['masaBerlaku'] ?? null,
            'created_by' => $userId,
        ]);

        $items = 0;
        foreach (($data['items'] ?? []) as $item) {
            $surat->items()->create([
                'nama' => $item['nama'] ?? null,
                'spesifikasi' => $item['spesifikasi'] ?? null,
                'jumlah' => $item['jumlah'] ?? null,
                'harga_satuan' => $item['hargaSatuan'] ?? null,
            ]);
            $items++;
        }

        return ['id' => $surat->id, 'items' => $items];
    }

    private function createBerita(Project $project, array $data, int $userId): array
    {
        $berita = $project->beritaAcara()->create([
            'nomor' => $data['nomor'] ?? null,
            'hari' => $data['hari'] ?? null,
            'tanggal' => $data['tanggal'] ?? null,
            'tempat' => $data['tempat'] ?? null,
            'nama_kegiatan' => $data['namaKegiatan'] ?? null,
            'tempat_buat' => $data['tempatBuat'] ?? null,
            'tanggal_buat' => $data['tanggalBuat'] ?? null,
            'created_by' => $userId,
        ]);

        $items = 0;
        foreach (($data['items'] ?? []) as $item) {
            $berita->items()->create([
                'nama' => $item['nama'] ?? null,
                'jumlah' => $item['jumlah'] ?? null,
                'spesifikasi' => $item['spesifikasi'] ?? 'Sesuai',
                'kondisi' => $item['kondisi'] ?? 'Baik',
            ]);
            $items++;
        }

        return ['id' => $berita->id, 'items' => $items];
    }

    private function createPerjanjian(Project $project, array $data, int $userId): array
    {
        $tipe = in_array($data['tipe'] ?? null, ['barang', 'jasa'], true)
            ? $data['tipe']
            : 'barang';

        $perjanjian = $project->perjanjian()->create([
            'tipe' => $tipe,
            'nomor' => $data['nomor'] ?? null,
            'judul' => $data['judul'] ?? ($tipe === 'jasa' ? 'Perjanjian Pengadaan Jasa' : 'Perjanjian Pengadaan Barang'),
            'tanggal' => $data['tanggal'] ?? null,
            'tempat' => $data['tempat'] ?? null,
            'hari_ttd' => $data['hariTtd'] ?? null,
            'konsideran' => $data['konsideran'] ?? null,
            'created_by' => $userId,
        ]);

        $pasalCount = $poinCount = $subCount = 0;

        foreach (($data['pasal'] ?? []) as $pasalData) {
            $pasal = $perjanjian->pasal()->create([
                'judul' => $pasalData['judul'] ?? '',
                'intro' => $pasalData['intro'] ?? '',
            ]);
            $pasalCount++;

            foreach (($pasalData['poin'] ?? []) as $poinData) {
                $poin = $pasal->poin()->create([
                    'text' => $poinData['text'] ?? '',
                ]);
                $poinCount++;

                foreach (($poinData['sub'] ?? []) as $subData) {
                    $poin->subPoin()->create([
                        'text' => $subData['text'] ?? '',
                    ]);
                    $subCount++;
                }
            }
        }

        return [
            'id' => $perjanjian->id,
            'pasal' => $pasalCount,
            'poin' => $poinCount,
            'sub' => $subCount,
        ];
    }

    private function createNda(Project $project, array $data, int $userId): Nda
    {
        return $project->nda()->create([
            'nomor' => $data['nomor'] ?? null,
            'hari' => $data['hari'] ?? null,
            'tanggal' => $data['tanggal'] ?? null,
            'tempat' => $data['tempat'] ?? null,
            'pn_nama' => $data['pnNama'] ?? null,
            'pn_ktp' => $data['pnKtp'] ?? null,
            'pn_alamat' => $data['pnAlamat'] ?? null,
            'pn_jabatan' => $data['pnJabatan'] ?? null,
            'pn_organisasi' => $data['pnOrganisasi'] ?? null,
            'pn_nomor_kontrak' => $data['pnNomorKontrak'] ?? null,
            'pn_tanggal_kontrak' => $data['pnTanggalKontrak'] ?? null,
            'konteks_pelaksanaan' => $data['konteksPelaksanaan'] ?? null,
            'jenis_dukungan' => $data['jenisDukungan'] ?? null,
            'objek_kegiatan' => $data['objekKegiatan'] ?? null,
            'objek_informasi' => $data['objekInformasi'] ?? null,
            'jangka_waktu' => $data['jangkaWaktu'] ?? null,
            'created_by' => $userId,
        ]);
    }
}
