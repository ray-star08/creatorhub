<?php

namespace Database\Seeders;

use App\Models\Idea;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * 20 dummy ideas for the demo creator so the Idea vault looks alive in the pitch.
 */
class IdeaSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', UserSeeder::DEMO_EMAIL)->first();

        if ($user === null || $user->ideas()->count() >= 20) {
            return;
        }

        Idea::factory()
            ->count(20)
            ->for($user)
            ->create();
    }
}
