<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Pre-populates the Kanban board for the demo creator.
 *
 * "Tasks" in task.md map to the existing Card pipeline in this codebase, so this
 * seeds Cards spread across every column to make the board look busy in the pitch.
 */
class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', UserSeeder::DEMO_EMAIL)->first();

        if ($user === null || $user->cards()->count() > 0) {
            return;
        }

        $user->cards()->createMany([
            ['title' => 'Why I quit coffee for 30 days', 'type' => 'Reel', 'column' => 'ideas', 'position' => 0],
            ['title' => '5 AI tools that saved me 10 hrs/week', 'type' => 'Carousel', 'column' => 'ideas', 'position' => 1],
            ['title' => 'My morning routine as a creator', 'type' => 'Short', 'column' => 'scripted', 'position' => 0],
            ['title' => 'Notion setup for content planning', 'type' => 'Long form', 'column' => 'scripted', 'position' => 1],
            ['title' => 'Day in the life: solo founder', 'type' => 'Vlog', 'column' => 'filming', 'position' => 0],
            ['title' => 'Top 3 productivity myths', 'type' => 'Reel', 'column' => 'editing', 'position' => 0],
            ['title' => 'How I edit videos in 20 minutes', 'type' => 'Short', 'column' => 'editing', 'position' => 1],
            ['title' => 'The tool that 10x my workflow', 'type' => 'Reel', 'column' => 'posted', 'position' => 0],
            ['title' => 'Behind the scenes of my studio', 'type' => 'Carousel', 'column' => 'posted', 'position' => 1],
        ]);
    }
}
