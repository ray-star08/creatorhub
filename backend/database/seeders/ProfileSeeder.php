<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Gives the demo creator a completed onboarding profile so AI generations and
 * the dashboard greeting feel personalised out of the box.
 */
class ProfileSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', UserSeeder::DEMO_EMAIL)->first();

        if ($user === null) {
            return;
        }

        $user->profile()->updateOrCreate([], [
            'niche' => 'Tech & Productivity',
            'platform' => 'TikTok',
            'audience' => 'Young professionals & students',
            'style' => 'Casual, high-energy, and educational',
        ]);
    }
}
