<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita_acara_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('berita_acara_id')
                ->constrained('berita_acara')
                ->cascadeOnDelete();

            $table->unsignedInteger('order_column')->default(0);

            $table->string('nama', 500)->nullable();
            $table->string('jumlah', 100)->nullable();
            $table->string('spesifikasi', 200)->default('Sesuai');
            $table->string('kondisi', 100)->default('Baik');

            $table->timestamps();

            $table->index(['berita_acara_id', 'order_column']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita_acara_items');
    }
};
