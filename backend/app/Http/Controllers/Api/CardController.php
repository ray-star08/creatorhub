<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CardController extends Controller
{
    /**
     * Return the pipeline grouped by column, matching the static board shape:
     * { ideas: [...], scripted: [...], filming: [...], editing: [...], posted: [...] }.
     */
    public function index(Request $request): JsonResponse
    {
        $cards = $request->user()->cards()
            ->orderBy('position')
            ->get()
            ->groupBy('column');

        $board = collect(Card::COLUMNS)
            ->mapWithKeys(fn (string $column) => [
                $column => $cards->get($column, collect())->values(),
            ]);

        return response()->json(['data' => $board]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:50'],
            'column' => ['sometimes', Rule::in(Card::COLUMNS)],
        ]);

        $column = $data['column'] ?? 'ideas';

        $card = $request->user()->cards()->create([
            'title' => $data['title'],
            'type' => $data['type'] ?? 'Idea',
            'column' => $column,
            'position' => $this->nextPosition($request, $column),
        ]);

        return response()->json(['data' => $card], 201);
    }

    /**
     * Update a card. Moving it to a new column awards XP (server-authoritative),
     * mirroring the static `drop()` rewards.
     */
    public function update(Request $request, Card $card): JsonResponse
    {
        $this->authorizeOwnership($request, $card);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:50'],
            'column' => ['sometimes', Rule::in(Card::COLUMNS)],
            'position' => ['sometimes', 'integer', 'min:0'],
        ]);

        $movedTo = ($data['column'] ?? $card->column) !== $card->column
            ? $data['column']
            : null;

        $card->update($data);

        $reward = null;
        if ($movedTo !== null) {
            $xp = Card::MOVE_REWARDS[$movedTo] ?? Card::DEFAULT_MOVE_REWARD;
            $reward = $request->user()->addXp($xp);
        }

        return response()->json([
            'data' => $card,
            'gamification' => $request->user()->gamification(),
            'reward' => $reward,
        ]);
    }

    public function destroy(Request $request, Card $card): JsonResponse
    {
        $this->authorizeOwnership($request, $card);

        $card->delete();

        return response()->json(status: 204);
    }

    private function nextPosition(Request $request, string $column): int
    {
        return (int) $request->user()->cards()->where('column', $column)->max('position') + 1;
    }

    private function authorizeOwnership(Request $request, Card $card): void
    {
        abort_unless($card->user_id === $request->user()->id, 403);
    }
}
