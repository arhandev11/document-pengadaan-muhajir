<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_penawaran_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_penawaran_id')
                ->constrained('surat_penawaran')
                ->cascadeOnDelete();

            $table->unsignedInteger('order_column')->default(0);

            $table->string('nama', 500)->nullable();
            $table->string('spesifikasi', 500)->nullable();

            // Jumlah & harga disimpan string bebas (§15.12) — konversi ke int via toNum()
            // hanya saat kalkulasi total di frontend/API resource.
            $table->string('jumlah', 100)->nullable();
            $table->string('harga_satuan', 100)->nullable();

            $table->timestamps();

            $table->index(['surat_penawaran_id', 'order_column']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_penawaran_items');
    }
};
