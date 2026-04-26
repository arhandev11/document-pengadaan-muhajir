<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            // Pihak Pertama (Penyedia) — embed, mengikuti shape state.project frontend
            $table->string('p1_nama')->nullable();
            $table->string('p1_jabatan')->nullable();
            $table->string('p1_perusahaan')->nullable();
            $table->text('p1_alamat')->nullable();

            // Pihak Kedua (Penerima)
            $table->string('p2_nama')->nullable();
            $table->string('p2_jabatan')->nullable();
            $table->string('p2_organisasi')->nullable();
            $table->text('p2_alamat')->nullable();

            // Data SPK — tanggal disengaja sebagai string (free-form) mengikuti §15.26 PRD
            $table->string('nomor_spk', 100)->nullable();
            $table->string('tanggal_spk', 100)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('nomor_spk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
