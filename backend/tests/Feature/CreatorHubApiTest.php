<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CreatorHubApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // The SPA auth routes only start a session for *stateful* requests, so
        // simulate the Next.js frontend's Origin (a SANCTUM_STATEFUL_DOMAINS host).
        $this->withHeader('Origin', 'http://localhost:3000');
    }

    public function test_registration_creates_a_user_with_gamification_defaults_and_starter_quests(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Nova Creator',
            'email' => 'nova@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.email', 'nova@example.com')
            ->assertJsonPath('user.level', 1)
            ->assertJsonPath('user.title', 'Aspiring Creator');

        $this->assertDatabaseCount('quests', 3);
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_login_then_me_returns_the_authenticated_user(): void
    {
        User::factory()->create(['email' => 'log@example.com', 'password' => 'password123']);

        $this->postJson('/api/login', ['email' => 'log@example.com', 'password' => 'password123'])
            ->assertOk()
            ->assertJsonPath('user.email', 'log@example.com');

        $this->getJson('/api/me')->assertOk()->assertJsonPath('user.email', 'log@example.com');
    }

    public function test_completing_a_quest_awards_xp_and_is_idempotent(): void
    {
        $user = User::factory()->create(['xp' => 0, 'momentum' => 0]);
        $quest = $user->quests()->create(['title' => 'Generate 1 Script', 'xp_reward' => 15]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/quests/{$quest->id}/complete")
            ->assertOk()
            ->assertJsonPath('gamification.xp', 15)
            ->assertJsonPath('reward.gained_xp', 15);

        // Second call must not double-award.
        $this->actingAs($user, 'sanctum')
            ->postJson("/api/quests/{$quest->id}/complete")
            ->assertOk()
            ->assertJsonPath('gamification.xp', 15)
            ->assertJsonPath('reward', null);
    }

    public function test_crossing_the_threshold_levels_the_user_up(): void
    {
        $user = User::factory()->create(['level' => 1, 'xp' => 90, 'next_level_xp' => 100]);
        $quest = $user->quests()->create(['title' => 'Push', 'xp_reward' => 15]);

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/quests/{$quest->id}/complete")
            ->assertOk()
            ->assertJsonPath('gamification.level', 2)
            ->assertJsonPath('gamification.xp', 5)
            ->assertJsonPath('gamification.next_level_xp', 150)
            ->assertJsonPath('gamification.title', 'Content Builder')
            ->assertJsonPath('reward.leveled_up', true);
    }

    public function test_moving_a_card_to_posted_awards_50_xp(): void
    {
        $user = User::factory()->create(['xp' => 0]);
        $card = $user->cards()->create(['title' => 'Vlog', 'type' => 'Reel', 'column' => 'editing']);

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/cards/{$card->id}", ['column' => 'posted'])
            ->assertOk()
            ->assertJsonPath('data.column', 'posted')
            ->assertJsonPath('gamification.xp', 50);
    }

    public function test_a_user_cannot_touch_another_users_quest(): void
    {
        $owner = User::factory()->create();
        $attacker = User::factory()->create();
        $quest = $owner->quests()->create(['title' => 'Private', 'xp_reward' => 10]);

        $this->actingAs($attacker, 'sanctum')
            ->postJson("/api/quests/{$quest->id}/complete")
            ->assertForbidden();
    }

    public function test_ai_script_endpoint_proxies_gemini_without_exposing_the_key(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    ['content' => ['parts' => [['text' => '**🔥 HOOK**\nStop scrolling!']]]],
                ],
            ]),
        ]);

        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/ai/script', ['topic' => '3 Hidden Features of VS Code'])
            ->assertOk()
            ->assertJsonStructure(['script']);

        // The key must travel to Gemini in a header, never back to the client.
        Http::assertSent(fn ($request) => $request->hasHeader('x-goog-api-key'));
    }

    public function test_ai_script_endpoint_validates_the_topic(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/ai/script', [])
            ->assertStatus(422);
    }
}
