<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * The original ideas table only stored a free-text `content`. The AI Idea
     * Generator (Milestone 7) produces structured ideas, so we widen the table
     * with title / description / engagement_score. All are nullable to stay
     * backward-compatible with the existing manual "save idea" flow, and
     * `content` becomes nullable now that a structured description can stand in.
     */
    public function up(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->string('title')->nullable()->after('user_id');
            $table->text('description')->nullable()->after('title');
            $table->unsignedInteger('engagement_score')->nullable()->after('description');
        });

        Schema::table('ideas', function (Blueprint $table) {
            $table->text('content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ideas', function (Blueprint $table) {
            $table->dropColumn(['title', 'description', 'engagement_score']);
        });
    }
};
