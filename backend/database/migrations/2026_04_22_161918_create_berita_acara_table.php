<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita_acara', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();

            $table->string('nomor', 100)->nullable();
            $table->string('hari', 30)->nullable();
            $table->string('tanggal', 100)->nullable();
            $table->string('tempat', 100)->nullable();
            $table->text('nama_kegiatan')->nullable();

            // Dua field lokasi terpisah (§15.25 PRD) — sengaja dipertahankan untuk fidelity
            $table->string('tempat_buat', 100)->nullable();
            $table->string('tanggal_buat', 100)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'nomor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita_acara');
    }
};
