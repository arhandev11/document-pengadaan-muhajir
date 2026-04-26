<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perjanjian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();

            $table->enum('tipe', ['barang', 'jasa'])->default('barang');
            $table->string('nomor', 100)->nullable();
            $table->string('judul', 255)->default('Perjanjian Pengadaan Barang');
            $table->string('tanggal', 100)->nullable();
            $table->string('tempat', 100)->nullable();
            $table->string('hari_ttd', 30)->nullable();
            $table->text('konsideran')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_id', 'nomor']);
            $table->index('tipe');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perjanjian');
    }
};
