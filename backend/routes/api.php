<?php

use App\Http\Controllers\Api\V1\ActivityController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BackupController;
use App\Http\Controllers\Api\V1\BeritaController;
use App\Http\Controllers\Api\V1\BeritaItemController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\ImportController;
use App\Http\Controllers\Api\V1\LogoController;
use App\Http\Controllers\Api\V1\NdaController;
use App\Http\Controllers\Api\V1\PasalController;
use App\Http\Controllers\Api\V1\PerjanjianController;
use App\Http\Controllers\Api\V1\PoinController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\SnapshotController;
use App\Http\Controllers\Api\V1\SubPoinController;
use App\Http\Controllers\Api\V1\SuratController;
use App\Http\Controllers\Api\V1\SuratItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:6,1')
        ->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

        Route::apiResource('projects', ProjectController::class);

        // Surat Penawaran — nested collection under project, flat individual
        Route::get('projects/{project}/surat', [SuratController::class, 'index'])->name('surat.index');
        Route::post('projects/{project}/surat', [SuratController::class, 'store'])->name('surat.store');
        Route::get('surat/{surat}', [SuratController::class, 'show'])->name('surat.show');
        Route::patch('surat/{surat}', [SuratController::class, 'update'])->name('surat.update');
        Route::delete('surat/{surat}', [SuratController::class, 'destroy'])->name('surat.destroy');

        // Surat items
        Route::post('surat/{surat}/items', [SuratItemController::class, 'store'])->name('surat.items.store');
        Route::post('surat/{surat}/items/reorder', [SuratItemController::class, 'reorder'])->name('surat.items.reorder');
        Route::patch('surat-items/{item}', [SuratItemController::class, 'update'])->name('surat.items.update');
        Route::delete('surat-items/{item}', [SuratItemController::class, 'destroy'])->name('surat.items.destroy');

        // Berita Acara Serah Terima
        Route::get('projects/{project}/berita', [BeritaController::class, 'index'])->name('berita.index');
        Route::post('projects/{project}/berita', [BeritaController::class, 'store'])->name('berita.store');
        Route::get('berita/{berita}', [BeritaController::class, 'show'])->name('berita.show');
        Route::patch('berita/{berita}', [BeritaController::class, 'update'])->name('berita.update');
        Route::delete('berita/{berita}', [BeritaController::class, 'destroy'])->name('berita.destroy');

        Route::post('berita/{berita}/items', [BeritaItemController::class, 'store'])->name('berita.items.store');
        Route::post('berita/{berita}/items/reorder', [BeritaItemController::class, 'reorder'])->name('berita.items.reorder');
        Route::patch('berita-items/{item}', [BeritaItemController::class, 'update'])->name('berita.items.update');
        Route::delete('berita-items/{item}', [BeritaItemController::class, 'destroy'])->name('berita.items.destroy');

        // Perjanjian Kerjasama
        Route::get('projects/{project}/perjanjian', [PerjanjianController::class, 'index'])->name('perjanjian.index');
        Route::post('projects/{project}/perjanjian', [PerjanjianController::class, 'store'])->name('perjanjian.store');
        Route::get('perjanjian/{perjanjian}', [PerjanjianController::class, 'show'])->name('perjanjian.show');
        Route::patch('perjanjian/{perjanjian}', [PerjanjianController::class, 'update'])->name('perjanjian.update');
        Route::delete('perjanjian/{perjanjian}', [PerjanjianController::class, 'destroy'])->name('perjanjian.destroy');
        Route::post('perjanjian/{perjanjian}/reset-template', [PerjanjianController::class, 'resetTemplate'])
            ->middleware('throttle:3,1')
            ->name('perjanjian.reset-template');

        // Pasal
        Route::post('perjanjian/{perjanjian}/pasal', [PasalController::class, 'store'])->name('pasal.store');
        Route::post('perjanjian/{perjanjian}/pasal/reorder', [PasalController::class, 'reorder'])->name('pasal.reorder');
        Route::patch('pasal/{pasal}', [PasalController::class, 'update'])->name('pasal.update');
        Route::delete('pasal/{pasal}', [PasalController::class, 'destroy'])->name('pasal.destroy');

        // Poin
        Route::post('pasal/{pasal}/poin', [PoinController::class, 'store'])->name('poin.store');
        Route::post('pasal/{pasal}/poin/reorder', [PoinController::class, 'reorder'])->name('poin.reorder');
        Route::patch('poin/{poin}', [PoinController::class, 'update'])->name('poin.update');
        Route::delete('poin/{poin}', [PoinController::class, 'destroy'])->name('poin.destroy');

        // Sub-poin
        Route::post('poin/{poin}/sub-poin', [SubPoinController::class, 'store'])->name('sub-poin.store');
        Route::post('poin/{poin}/sub-poin/reorder', [SubPoinController::class, 'reorder'])->name('sub-poin.reorder');
        Route::patch('sub-poin/{subPoin}', [SubPoinController::class, 'update'])->name('sub-poin.update');
        Route::delete('sub-poin/{subPoin}', [SubPoinController::class, 'destroy'])->name('sub-poin.destroy');

        // NDA (Pernyataan Kerahasiaan) — integrated penuh ke pipeline, menutup gap PRD §15.1
        Route::get('projects/{project}/nda', [NdaController::class, 'index'])->name('nda.index');
        Route::post('projects/{project}/nda', [NdaController::class, 'store'])->name('nda.store');
        Route::get('nda/{nda}', [NdaController::class, 'show'])->name('nda.show');
        Route::patch('nda/{nda}', [NdaController::class, 'update'])->name('nda.update');
        Route::delete('nda/{nda}', [NdaController::class, 'destroy'])->name('nda.destroy');

        // Snapshot & Restore — polymorphic untuk 5 entity
        // Note: type segment disesuaikan dengan URL prefix tiap entity
        // (projects plural, yang lain singular).
        Route::get('{type}/{id}/snapshots', [SnapshotController::class, 'indexFor'])
            ->whereIn('type', ['projects', 'surat', 'berita', 'perjanjian', 'nda'])
            ->name('snapshots.index');
        Route::post('{type}/{id}/snapshots', [SnapshotController::class, 'store'])
            ->whereIn('type', ['projects', 'surat', 'berita', 'perjanjian', 'nda'])
            ->name('snapshots.store');
        Route::get('snapshots/{snapshot}', [SnapshotController::class, 'show'])->name('snapshots.show');
        Route::post('snapshots/{snapshot}/restore', [SnapshotController::class, 'restore'])->name('snapshots.restore');
        Route::delete('snapshots/{snapshot}', [SnapshotController::class, 'destroy'])->name('snapshots.destroy');

        // Activity Log API — expose audit trail untuk Riwayat page
        Route::get('activity/stats', [ActivityController::class, 'stats'])->name('activity.stats');
        Route::get('activity', [ActivityController::class, 'index'])->name('activity.index');
        Route::delete('activity/{id}', [ActivityController::class, 'destroy'])
            ->whereNumber('id')
            ->name('activity.destroy');
        Route::delete('activity', [ActivityController::class, 'clear'])->name('activity.clear');

        // Events (PRINT / EXPORT_*) — client-side report, backend hanya log
        Route::post('events', [EventController::class, 'store'])->name('events.store');

        // Full backup export — rate-limited (heavy query)
        Route::get('backup/full', [BackupController::class, 'full'])
            ->middleware('throttle:3,1')
            ->name('backup.full');

        // Logo (singleton AppSetting + Spatie Media Library)
        Route::get('logo', [LogoController::class, 'show'])->name('logo.show');
        Route::post('logo', [LogoController::class, 'store'])->name('logo.store');
        Route::delete('logo', [LogoController::class, 'destroy'])->name('logo.destroy');

        // Legacy importer — migrasi data dari localStorage frontend lama
        // Rate-limited: 2 per menit, operasi mahal & non-idempotent
        Route::post('import/legacy-localstorage', [ImportController::class, 'legacy'])
            ->middleware('throttle:2,1')
            ->name('import.legacy');
    });
});
