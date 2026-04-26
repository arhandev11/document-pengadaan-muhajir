<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();

            // Identitas dokumen
            $table->string('nomor', 100)->nullable();
            $table->string('hari', 30)->nullable();
            $table->string('tanggal', 100)->nullable();
            $table->string('tempat', 100)->nullable();

            // Pihak Penerima (perorangan — bukan dari project p2)
            // Prefix pn_ = "Pihak Penerima", mirror field frontend pnXxx
            $table->string('pn_nama', 255)->nullable();
            $table->string('pn_ktp', 30)->nullable();
            $table->text('pn_alamat')->nullable();
            $table->string('pn_jabatan', 255)->nullable();
            $table->string('pn_organisasi', 255)->nullable();
            $table->string('pn_nomor_kontrak', 100)->nullable();
            $table->string('pn_tanggal_kontrak', 100)->nullable();

            // Catatan: Pihak Pengungkap otomatis dari project.p1 — tidak disimpan di sini
            // (lihat §18 Role Mapping PRD)

            // Konteks & isi NDA
            $table->text('konteks_pelaksanaan')->nullable();
            $table->text('jenis_dukungan')->nullable();
            $table->text('objek_kegiatan')->nullable();
            $table->text('objek_informasi')->nullable();
            $table->string('jangka_waktu', 100)->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'nomor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nda');
    }
};
