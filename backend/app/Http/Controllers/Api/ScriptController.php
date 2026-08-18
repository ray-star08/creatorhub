<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Script;
use App\Services\AI\TabiAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

/**
 * AI Script Generator (Milestone 8). Turns a saved idea into a ready-to-shoot
 * short-form script: title, opening hook, main content and a closing CTA.
 */
class ScriptController extends Controller
{
    /**
     * List the creator's saved scripts (newest first), with their source idea.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->scripts()->with('idea')->latest()->get(),
        ]);
    }

    /**
     * Generate a script from an idea via Tabi AI, persist it, and return it.
     */
    public function generate(Request $request, TabiAIService $ai): JsonResponse
    {
        $data = $request->validate([
            'idea_id' => ['required', 'integer', 'exists:ideas,id'],
            'tone' => ['sometimes', 'string', 'max:100'],
            'duration' => ['sometimes', 'string', 'max:100'],
        ]);

        // Scope through the relation so a creator can only script their own ideas.
        $idea = $request->user()->ideas()->findOrFail($data['idea_id']);

        $tone = $data['tone'] ?? 'energetic and casual';
        $duration = $data['duration'] ?? '60 seconds';

        $ideaTitle = $idea->title ?? $idea->content;
        $ideaDescription = $idea->description ?? $idea->content ?? '';

        $system = 'You are a senior short-form video scriptwriter. You always reply with a single valid JSON object and nothing else.';

        $user = <<<PROMPT
        Write a {$duration} short-form video script for the idea below.
        Tone: {$tone}.

        Idea title: {$ideaTitle}
        Idea details: {$ideaDescription}

        Return a JSON object with EXACTLY this shape:
        {
          "title": string,   // a punchy script/video title
          "hook": string,    // a 1-2 sentence opening hook that stops the scroll
          "content": string, // the full body of the script, ready to read on camera
          "cta": string      // a short closing call-to-action
        }
        PROMPT;

        try {
            $payload = $ai->generateJSON($system, $user);
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => 'The AI service is unavailable right now.',
                'error' => $e->getMessage(),
            ], 502);
        }

        $script = $request->user()->scripts()->create([
            'idea_id' => $idea->id,
            'title' => (string) ($payload['title'] ?? $ideaTitle ?? 'Untitled script'),
            'hook' => (string) ($payload['hook'] ?? ''),
            'content' => (string) ($payload['content'] ?? ''),
            'cta' => (string) ($payload['cta'] ?? ''),
        ]);

        return response()->json([
            'data' => $script->load('idea'),
        ], 201);
    }

    /**
     * Delete one of the creator's scripts.
     */
    public function destroy(Request $request, Script $script): JsonResponse
    {
        abort_unless($script->user_id === $request->user()->id, 403);

        $script->delete();

        return response()->json(status: 204);
    }
}
