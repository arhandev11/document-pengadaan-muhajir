<?php

namespace App\Services;

use App\Models\Pasal;
use App\Models\Perjanjian;
use App\Models\Poin;
use App\Models\SubPoin;
use App\Support\PasalTemplate;
use Illuminate\Support\Facades\DB;

class PerjanjianService
{
    /**
     * Apply template Barang atau Jasa — membuat pasal + poin + sub_poin
     * dalam satu transaksi. Asumsi: perjanjian sudah kosong (no existing pasal).
     */
    public function applyTemplate(Perjanjian $perjanjian, string $tipe): Perjanjian
    {
        $template = PasalTemplate::forTipe($tipe);

        DB::transaction(function () use ($perjanjian, $template) {
            foreach ($template as $pasalData) {
                $pasal = $perjanjian->pasal()->create([
                    'judul' => $pasalData['judul'],
                    'intro' => $pasalData['intro'] ?? '',
                ]);

                foreach ($pasalData['poin'] as $poinData) {
                    $poin = $pasal->poin()->create([
                        'text' => $poinData['text'],
                    ]);

                    foreach (($poinData['sub'] ?? []) as $subData) {
                        $poin->subPoin()->create([
                            'text' => $subData['text'],
                        ]);
                    }
                }
            }
        });

        return $perjanjian->load('pasal.poin.subPoin');
    }

    /**
     * Reset perjanjian: delete all pasal (cascade ke poin & sub_poin),
     * lalu apply template baru sesuai tipe yang diminta.
     */
    public function resetTemplate(Perjanjian $perjanjian, string $newTipe): Perjanjian
    {
        DB::transaction(function () use ($perjanjian, $newTipe) {
            $perjanjian->pasal()->delete();

            $perjanjian->update([
                'tipe' => $newTipe,
                'judul' => $newTipe === 'jasa'
                    ? 'Perjanjian Pengadaan Jasa'
                    : 'Perjanjian Pengadaan Barang',
            ]);
        });

        return $this->applyTemplate($perjanjian->fresh(), $newTipe);
    }
}
