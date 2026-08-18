<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Profile>
 */
class ProfileFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'niche' => fake()->randomElement([
                'Tech & Productivity', 'Personal Finance', 'Fitness & Health',
                'Cooking', 'Travel', 'Gaming', 'Fashion & Beauty',
            ]),
            'platform' => fake()->randomElement(['TikTok', 'Instagram Reels', 'YouTube Shorts']),
            'audience' => fake()->randomElement([
                'Gen Z students', 'Young professionals', 'Aspiring entrepreneurs', 'Busy parents',
            ]),
            'style' => fake()->randomElement([
                'Casual & funny', 'Educational', 'Inspirational', 'Bold & edgy',
            ]),
        ];
    }
}
