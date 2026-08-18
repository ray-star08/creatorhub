<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * A creator's onboarding context (Milestone 4). One profile per user — this
     * is the "Niche / Platform / Audience / Style" that later gets injected into
     * every AI prompt so generations feel on-brand.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('niche')->nullable();
            $table->string('platform')->nullable();
            $table->string('audience')->nullable();
            $table->string('style')->nullable();
            $table->timestamps();

            $table->unique('user_id'); // exactly one profile per creator
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
