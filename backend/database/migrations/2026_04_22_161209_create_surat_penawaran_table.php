<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_penawaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();

            // Identitas surat — tanggal bebas-form (§15.26 PRD)
            $table->string('nomor', 100)->nullable();
            $table->string('tanggal', 100)->nullable();
            $table->string('perihal', 500)->nullable();
            $table->text('nama_program')->nullable();

            // Keterangan
            $table->string('garansi', 255)->nullable();
            $table->string('waktu_kirim', 255)->nullable();
            $table->string('masa_berlaku', 255)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'nomor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_penawaran');
    }
};
