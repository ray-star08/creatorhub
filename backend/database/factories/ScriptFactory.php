<?php

namespace Database\Factories;

use App\Models\Idea;
use App\Models\Script;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Script>
 */
class ScriptFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'idea_id' => Idea::factory(),
            'title' => rtrim(fake()->sentence(5), '.'),
            'hook' => fake()->sentence(12),
            'content' => fake()->paragraphs(3, true),
            'cta' => fake()->randomElement([
                'Follow for more tips like this!',
                'Save this for later 🔖',
                'Comment your thoughts below 👇',
                'Share this with a friend who needs it',
            ]),
        ];
    }
}
