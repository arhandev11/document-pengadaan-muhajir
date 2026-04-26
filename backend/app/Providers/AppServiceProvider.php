<?php

namespace App\Providers;

use App\Models\BeritaAcara;
use App\Models\Nda;
use App\Models\Perjanjian;
use App\Models\Project;
use App\Models\SuratPenawaran;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Morph map — string aliases untuk polymorphic relations.
        // Snapshot.snapshotable_type & activity_log.subject_type akan pakai ini.
        // Non-enforcing (morphMap, bukan enforceMorphMap) agar FQCN lama di
        // activity_log tetap bisa dibaca.
        Relation::morphMap([
            'project' => Project::class,
            'surat' => SuratPenawaran::class,
            'berita' => BeritaAcara::class,
            'perjanjian' => Perjanjian::class,
            'nda' => Nda::class,
        ]);
    }
}
