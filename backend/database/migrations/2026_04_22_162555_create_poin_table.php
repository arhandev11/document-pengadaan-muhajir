<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('poin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pasal_id')->constrained('pasal')->cascadeOnDelete();

            $table->unsignedInteger('order_column')->default(0);
            $table->text('text')->nullable();

            $table->timestamps();

            $table->index(['pasal_id', 'order_column']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poin');
    }
};
