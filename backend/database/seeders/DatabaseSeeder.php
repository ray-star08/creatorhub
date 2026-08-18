<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the app for the demo/pitch.
     *
     * The primary demo creator (demo@creatorhub.com) is built up by the dedicated
     * seeders below — profile, 20 ideas, 15 scripts and a full Kanban board — so
     * the dashboard looks alive. The original lightweight test@example.com account
     * is kept for backward compatibility with existing flows.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProfileSeeder::class,
            IdeaSeeder::class,
            ScriptSeeder::class,
            TaskSeeder::class,
        ]);

        if (! User::where('email', 'test@example.com')->exists()) {
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'xp' => 40,
                'streak' => 3,
            ]);

            $user->quests()->createMany([
                ['title' => 'Generate 1 Script', 'xp_reward' => 15],
                ['title' => 'Save 2 Ideas', 'xp_reward' => 10],
                ['title' => 'Move 1 task to Editing', 'xp_reward' => 20],
            ]);

            $user->cards()->createMany([
                ['title' => 'Why I quit coffee', 'type' => 'Reel', 'column' => 'ideas', 'position' => 0],
                ['title' => 'Top 5 AI Tools', 'type' => 'Carousel', 'column' => 'scripted', 'position' => 0],
                ['title' => 'Day in Life Vlog', 'type' => 'Long form', 'column' => 'editing', 'position' => 0],
            ]);
        }
    }
}
