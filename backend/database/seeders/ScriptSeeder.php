<?php

namespace Database\Seeders;

use App\Models\Idea;
use App\Models\Script;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * 15 scripts for the demo creator, each linked to one of their seeded ideas.
 */
class ScriptSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', UserSeeder::DEMO_EMAIL)->first();

        if ($user === null || $user->scripts()->count() >= 15) {
            return;
        }

        // Fall back to freshly-made ideas if IdeaSeeder hasn't populated any.
        $ideaIds = $user->ideas()->pluck('id');

        if ($ideaIds->isEmpty()) {
            $ideaIds = Idea::factory()->count(5)->for($user)->create()->pluck('id');
        }

        Script::factory()
            ->count(15)
            ->for($user)
            ->state(fn () => ['idea_id' => $ideaIds->random()])
            ->create();
    }
}
