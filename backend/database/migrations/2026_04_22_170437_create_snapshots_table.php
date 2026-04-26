<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('snapshots', function (Blueprint $table) {
            $table->id();

            // Polymorphic owner — project, surat, berita, perjanjian, nda
            $table->string('snapshotable_type', 40);
            $table->unsignedBigInteger('snapshotable_id');

            $table->string('label', 255);
            $table->json('data');
            $table->char('data_hash', 64); // SHA256 hex — menutup PRD §15.16

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['snapshotable_type', 'snapshotable_id']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('snapshots');
    }
};
