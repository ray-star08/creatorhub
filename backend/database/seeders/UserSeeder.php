<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * The demo creator used for the video pitch. Idempotent: re-running db:seed
 * updates the same account instead of creating duplicates.
 */
class UserSeeder extends Seeder
{
    public const DEMO_EMAIL = 'demo@creatorhub.com';

    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => self::DEMO_EMAIL],
            [
                'name' => 'Demo Creator',
                'password' => 'password', // hashed via the model cast
                'level' => 3,
                'xp' => 65,
                'next_level_xp' => 225,
                'title' => User::TITLES[3],
                'momentum' => 60,
                'streak' => 5,
            ],
        );

        // Seed starter quests once so the dashboard is never empty.
        if ($user->quests()->count() === 0) {
            $user->quests()->createMany([
                ['title' => 'Generate 1 Script', 'xp_reward' => 15],
                ['title' => 'Save 2 Ideas', 'xp_reward' => 10],
                ['title' => 'Move 1 task to Editing', 'xp_reward' => 20],
            ]);
        }
    }
}
