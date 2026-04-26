<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_poin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poin_id')->constrained('poin')->cascadeOnDelete();

            $table->unsignedInteger('order_column')->default(0);
            $table->text('text')->nullable();

            $table->timestamps();

            $table->index(['poin_id', 'order_column']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_poin');
    }
};
