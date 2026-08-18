<?php

namespace Database\Factories;

use App\Models\Idea;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Idea>
 */
class IdeaFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = rtrim(fake()->sentence(6), '.');
        $description = fake()->paragraph();

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'description' => $description,
            'engagement_score' => fake()->numberBetween(45, 98),
            'content' => $description,
            'source' => 'ai',
        ];
    }
}
