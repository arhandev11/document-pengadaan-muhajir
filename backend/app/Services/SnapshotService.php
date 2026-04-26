<?php

namespace App\Services;

use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\Snapshot;
use App\Models\SuratPenawaran;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;

class SnapshotService
{
    /**
     * Relasi yang di-serialize per entity type. Diurutkan untuk menjaga JSON
     * stabil — penting agar data_hash reproducible.
     */
    private const CAPTURE_RELATIONS = [
        Project::class => [],
        SuratPenawaran::class => ['items'],
        BeritaAcara::class => ['items'],
        Perjanjian::class => ['pasal.poin.subPoin'],
        Nda::class => [],
    ];

    public function capture(Model $entity, ?string $label, ?int $userId): Snapshot
    {
        $relations = self::CAPTURE_RELATIONS[$entity::class] ?? [];

        $entity = $entity->fresh($relations);

        $data = $entity->toArray();
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $hash = hash('sha256', $json);

        return $entity->snapshots()->create([
            'label' => $label ?: $this->defaultLabel($entity),
            'data' => $data,
            'data_hash' => $hash,
            'created_by' => $userId,
        ]);
    }

    /**
     * Restore dari snapshot. Strategi:
     *   - Top-level fields: update in place (preserve entity id).
     *   - Nested items/pasal: delete all existing (cascade), re-create dari data.
     */
    public function restore(Snapshot $snapshot): Model
    {
        /** @var Model $entity */
        $entity = $snapshot->snapshotable;
        abort_if(! $entity, 404, 'Subject snapshot tidak ditemukan atau sudah dihapus.');

        $data = $snapshot->data;

        DB::transaction(function () use ($entity, $data) {
            $this->restoreEntity($entity, $data);
        });

        return $entity->fresh(self::CAPTURE_RELATIONS[$entity::class] ?? []);
    }

    private function restoreEntity(Model $entity, array $data): void
    {
        match ($entity::class) {
            SuratPenawaran::class => $this->restoreSurat($entity, $data),
            BeritaAcara::class => $this->restoreBerita($entity, $data),
            Perjanjian::class => $this->restorePerjanjian($entity, $data),
            Project::class, Nda::class => $this->restoreFlat($entity, $data),
        };
    }

    private function restoreFlat(Model $entity, array $data): void
    {
        $entity->update($this->stripMeta($entity, $data));
    }

    private function restoreSurat(SuratPenawaran $surat, array $data): void
    {
        $items = $data['items'] ?? [];
        $surat->update($this->stripMeta($surat, $data, ['items']));
        $surat->items()->delete();

        foreach ($items as $item) {
            $surat->items()->create($this->stripItemMeta($item));
        }
    }

    private function restoreBerita(BeritaAcara $berita, array $data): void
    {
        $items = $data['items'] ?? [];
        $berita->update($this->stripMeta($berita, $data, ['items']));
        $berita->items()->delete();

        foreach ($items as $item) {
            $berita->items()->create($this->stripItemMeta($item));
        }
    }

    private function restorePerjanjian(Perjanjian $perjanjian, array $data): void
    {
        $pasalData = $data['pasal'] ?? [];
        $perjanjian->update($this->stripMeta($perjanjian, $data, ['pasal']));
        $perjanjian->pasal()->delete();

        foreach ($pasalData as $pd) {
            $pasal = $perjanjian->pasal()->create([
                'judul' => $pd['judul'] ?? '',
                'intro' => $pd['intro'] ?? '',
            ]);

            foreach ($pd['poin'] ?? [] as $poinData) {
                $poin = $pasal->poin()->create([
                    'text' => $poinData['text'] ?? '',
                ]);

                foreach ($poinData['sub'] ?? $poinData['sub_poin'] ?? [] as $subData) {
                    $poin->subPoin()->create([
                        'text' => $subData['text'] ?? '',
                    ]);
                }
            }
        }
    }

    /**
     * Buang field meta (id, timestamps, FK, dst.) yang tidak boleh di-update.
     * Plus buang nested keys yang di-handle terpisah.
     */
    private function stripMeta(Model $entity, array $data, array $extraExcept = []): array
    {
        $except = array_merge(
            ['id', 'created_at', 'updated_at', 'deleted_at', 'project_id', 'created_by'],
            $extraExcept,
        );

        return collect($data)
            ->only($entity->getFillable())
            ->except($except)
            ->all();
    }

    private function stripItemMeta(array $item): array
    {
        return collect($item)
            ->except(['id', 'created_at', 'updated_at', 'surat_penawaran_id',
                'berita_acara_id', 'order_column'])
            ->all();
    }

    private function defaultLabel(Model $entity): string
    {
        $now = now()->format('d M Y H:i');
        $type = match ($entity::class) {
            Project::class => 'Setup Proyek',
            SuratPenawaran::class => 'Surat Penawaran',
            BeritaAcara::class => 'Berita Acara',
            Perjanjian::class => 'Perjanjian',
            Nda::class => 'NDA',
            default => 'Dokumen',
        };

        return "Snapshot {$type} — {$now}";
    }
}
