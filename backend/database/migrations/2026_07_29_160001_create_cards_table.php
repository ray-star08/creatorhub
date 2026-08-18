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
     * A "card" is a single item on the Kanban content pipeline. Its `column`
     * mirrors the static board: ideas → scripted → filming → editing → posted.
     */
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('type')->default('Idea'); // Reel, Carousel, Short, Long form, ...
            $table->string('column')->default('ideas');
            $table->unsignedInteger('position')->default(0); // order within a column
            $table->timestamps();

            $table->index(['user_id', 'column']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
