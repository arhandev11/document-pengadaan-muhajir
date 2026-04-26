<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perjanjian_id')->constrained('perjanjian')->cascadeOnDelete();

            $table->unsignedInteger('order_column')->default(0);
            $table->string('judul', 255)->default('Pasal Baru');
            $table->text('intro')->nullable();

            $table->timestamps();

            $table->index(['perjanjian_id', 'order_column']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pasal');
    }
};
