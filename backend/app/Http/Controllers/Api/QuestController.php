<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestController extends Controller
{
    /**
     * List the authenticated creator's daily quests.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->quests()->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'xp_reward' => ['sometimes', 'integer', 'min:0', 'max:1000'],
        ]);

        $quest = $request->user()->quests()->create($data);

        return response()->json(['data' => $quest], 201);
    }

    public function update(Request $request, Quest $quest): JsonResponse
    {
        $this->authorizeOwnership($request, $quest);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'xp_reward' => ['sometimes', 'integer', 'min:0', 'max:1000'],
        ]);

        $quest->update($data);

        return response()->json(['data' => $quest]);
    }

    /**
     * Complete a quest once, awarding its XP reward to the creator.
     */
    public function complete(Request $request, Quest $quest): JsonResponse
    {
        $this->authorizeOwnership($request, $quest);

        if ($quest->is_completed) {
            return response()->json([
                'data' => $quest,
                'gamification' => $request->user()->gamification(),
                'reward' => null,
            ]);
        }

        $quest->update(['is_completed' => true, 'completed_at' => now()]);
        $reward = $request->user()->addXp($quest->xp_reward);

        return response()->json([
            'data' => $quest,
            'gamification' => $request->user()->gamification(),
            'reward' => $reward,
        ]);
    }

    public function destroy(Request $request, Quest $quest): JsonResponse
    {
        $this->authorizeOwnership($request, $quest);

        $quest->delete();

        return response()->json(status: 204);
    }

    private function authorizeOwnership(Request $request, Quest $quest): void
    {
        abort_unless($quest->user_id === $request->user()->id, 403);
    }
}
