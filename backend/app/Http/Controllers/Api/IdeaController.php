<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Idea;
use App\Services\AI\TabiAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use RuntimeException;

class IdeaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->ideas()->latest()->get(),
        ]);
    }

    /**
     * AI Idea Generator (Milestone 7).
     *
     * Injects the creator's profile context (niche, audience, platform) plus the
     * requested topic into a Tabi AI prompt, then persists every returned
     * idea and hands the saved records back to the frontend.
     */
    public function generate(Request $request, TabiAIService $ai): JsonResponse
    {
        $data = $request->validate([
            'topic' => ['required', 'string', 'max:255'],
            'count' => ['sometimes', 'integer', 'min:1', 'max:10'],
        ]);

        $count = $data['count'] ?? 5;
        $profile = $request->user()->profile;

        $niche = $profile?->niche ?: 'general content creation';
        $audience = $profile?->audience ?: 'a broad social media audience';
        $platform = $profile?->platform ?: 'TikTok / Reels / Shorts';

        $system = 'You are a senior short-form content strategist. You always reply with a single valid JSON object and nothing else.';

        $user = <<<PROMPT
        Generate {$count} viral short-form content ideas.

        Creator niche: {$niche}
        Target audience: {$audience}
        Primary platform: {$platform}
        Topic focus: {$data['topic']}

        Return a JSON object with EXACTLY this shape:
        {
          "ideas": [
            { "title": string, "description": string, "engagement_score": integer }
          ]
        }
        The "ideas" array must contain exactly {$count} items. "engagement_score"
        is your 0-100 estimate of the idea's viral potential.
        PROMPT;

        try {
            $payload = $ai->generateJSON($system, $user);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => 'The AI service is unavailable right now.',
                'error' => $e->getMessage(),
            ], 502);
        }

        $ideas = $this->persistGeneratedIdeas($request, $payload['ideas'] ?? []);

        return response()->json([
            'data' => $ideas,
        ], 201);
    }

    /**
     * Save an idea to the vault. Awards +10 XP, matching the static `saveIdea()`.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
            'source' => ['sometimes', Rule::in(['ai', 'manual'])],
        ]);

        $idea = $request->user()->ideas()->create([
            'content' => $data['content'],
            'source' => $data['source'] ?? 'ai',
        ]);

        $reward = $request->user()->addXp(10);

        return response()->json([
            'data' => $idea,
            'gamification' => $request->user()->gamification(),
            'reward' => $reward,
        ], 201);
    }

    public function destroy(Request $request, Idea $idea): JsonResponse
    {
        abort_unless($idea->user_id === $request->user()->id, 403);

        $idea->delete();

        return response()->json(status: 204);
    }

    /**
     * Persist the raw ideas array from the AI payload and return the saved models.
     *
     * @param  array<int, mixed>  $rawIdeas
     * @return Collection<int, Idea>
     */
    private function persistGeneratedIdeas(Request $request, array $rawIdeas): Collection
    {
        return collect($rawIdeas)
            ->filter(fn ($idea) => is_array($idea) && ! empty($idea['title']))
            ->map(function (array $idea) use ($request): Idea {
                $description = (string) ($idea['description'] ?? '');

                return $request->user()->ideas()->create([
                    'title' => (string) $idea['title'],
                    'description' => $description,
                    'engagement_score' => (int) ($idea['engagement_score'] ?? 0),
                    // Mirror into `content` to keep the legacy idea list working.
                    'content' => $description !== '' ? $description : (string) $idea['title'],
                    'source' => 'ai',
                ]);
            })
            ->values();
    }
}
