<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Kanban board API (Milestone 9).
 *
 * task.md calls these "tasks"; in this codebase the Kanban item is the existing
 * `Card` model, so this controller is the single translation layer between the
 * two vocabularies. The frontend speaks task.md's status enum
 * (idea → draft → editing → ready → published) while `Card` stores the original
 * pipeline columns (ideas → scripted → filming → editing → posted). Every value
 * that crosses the wire is mapped here so the Card model, CardController and
 * seeders can keep using their own column names untouched.
 */
class TaskController extends Controller
{
    /**
     * Frontend task status → backend Card column. A 1:1 bijection, so it also
     * drives the reverse (column → status) lookup via array_flip().
     */
    private const STATUS_TO_COLUMN = [
        'idea' => 'ideas',
        'draft' => 'scripted',
        'editing' => 'editing',
        'ready' => 'filming',
        'published' => 'posted',
    ];

    /**
     * Flat, board-ordered list of the creator's Kanban cards, each shaped as the
     * frontend Task (with a `status`, not a `column`).
     */
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()->cards()
            ->orderBy('column')
            ->orderBy('position')
            ->get()
            ->map(fn (Card $card): array => $this->toTask($card));

        return response()->json(['data' => $tasks]);
    }

    /**
     * Create a new Kanban card from the frontend's {title, status} payload.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(array_keys(self::STATUS_TO_COLUMN))],
        ]);

        $column = self::STATUS_TO_COLUMN[$data['status']];

        $card = $request->user()->cards()->create([
            'title' => $data['title'],
            'type' => 'Idea',
            'column' => $column,
            'position' => $this->nextPosition($request, $column),
        ]);

        return response()->json(['data' => $this->toTask($card)], 201);
    }

    /**
     * Move a card to a new column (the onDragEnd handler fires this).
     *
     * Moving a card awards XP server-side, mirroring CardController@update so the
     * gamification stays authoritative no matter which endpoint drives the board.
     */
    public function updateStatus(Request $request, Card $task): JsonResponse
    {
        abort_unless($task->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'status' => ['required', Rule::in(array_keys(self::STATUS_TO_COLUMN))],
        ]);

        $column = self::STATUS_TO_COLUMN[$data['status']];
        $moved = $column !== $task->column;
        $task->update(['column' => $column]);

        $reward = null;
        if ($moved) {
            $xp = Card::MOVE_REWARDS[$column] ?? Card::DEFAULT_MOVE_REWARD;
            $reward = $request->user()->addXp($xp);
        }

        return response()->json([
            'data' => $this->toTask($task),
            'gamification' => $request->user()->gamification(),
            'reward' => $reward,
        ]);
    }

    /**
     * Shape a Card as the frontend Task, translating column → status.
     *
     * @return array<string, mixed>
     */
    private function toTask(Card $card): array
    {
        return [
            'id' => $card->id,
            'user_id' => $card->user_id,
            'title' => $card->title,
            'status' => array_flip(self::STATUS_TO_COLUMN)[$card->column] ?? 'idea',
            'created_at' => $card->created_at,
            'updated_at' => $card->updated_at,
        ];
    }

    private function nextPosition(Request $request, string $column): int
    {
        return (int) $request->user()->cards()->where('column', $column)->max('position') + 1;
    }
}
