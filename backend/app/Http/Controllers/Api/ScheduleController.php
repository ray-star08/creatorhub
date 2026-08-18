<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Smart Calendar (Milestone 10). CRUD for the creator's publishing schedule that
 * the frontend calendar view reads from and writes to.
 */
class ScheduleController extends Controller
{
    /**
     * All of the creator's scheduled entries, ordered by publish date.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user()->schedules()->orderBy('publish_date')->get(),
        ]);
    }

    /**
     * Add a new entry to the publishing calendar.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'publish_date' => ['required', 'date'],
        ]);

        $schedule = $request->user()->schedules()->create($data);

        return response()->json([
            'data' => $schedule,
        ], 201);
    }

    /**
     * Delete a scheduled entry.
     */
    public function destroy(Request $request, Schedule $schedule): JsonResponse
    {
        abort_unless($schedule->user_id === $request->user()->id, 403);

        $schedule->delete();

        return response()->json(status: 204);
    }
}
