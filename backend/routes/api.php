<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\IdeaController;
use App\Http\Controllers\Api\ModelBackupController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\QuestController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ScriptController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public authentication routes
|--------------------------------------------------------------------------
| Consumed by the Next.js SPA after hitting /sanctum/csrf-cookie first.
*/
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

/*
|--------------------------------------------------------------------------
| Protected routes (Sanctum stateful session)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Daily quests
    Route::get('/quests', [QuestController::class, 'index']);
    Route::post('/quests', [QuestController::class, 'store']);
    Route::patch('/quests/{quest}', [QuestController::class, 'update']);
    Route::post('/quests/{quest}/complete', [QuestController::class, 'complete']);
    Route::delete('/quests/{quest}', [QuestController::class, 'destroy']);

    // Kanban pipeline cards
    Route::get('/cards', [CardController::class, 'index']);
    Route::post('/cards', [CardController::class, 'store']);
    Route::patch('/cards/{card}', [CardController::class, 'update']);
    Route::delete('/cards/{card}', [CardController::class, 'destroy']);

    // Onboarding / creator profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/setup', [ProfileController::class, 'setup']);

    // Saved ideas
    Route::get('/ideas', [IdeaController::class, 'index']);
    Route::post('/ideas', [IdeaController::class, 'store']);
    Route::delete('/ideas/{idea}', [IdeaController::class, 'destroy']);

    // Scripts
    Route::get('/scripts', [ScriptController::class, 'index']);
    Route::delete('/scripts/{script}', [ScriptController::class, 'destroy']);

    // Kanban board (backed by the Card pipeline)
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    // Publishing calendar
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);

    // AI generators (Tabi AI) — rate-limited to protect the upstream quota
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/ideas/generate', [IdeaController::class, 'generate']);
        Route::post('/scripts/generate', [ScriptController::class, 'generate']);
    });

    // Model backup — list available models and test individual models
    Route::get('/models', [ModelBackupController::class, 'models']);
    Route::post('/models/test', [ModelBackupController::class, 'test']);

    // Legacy AI proxy (Gemini) — kept for the existing script/analyze/hooks
    // features; superseded by the Tabi-backed generators above.
    Route::middleware('throttle:20,1')->prefix('ai')->group(function () {
        Route::post('/script', [AiController::class, 'script']);
        Route::post('/analyze', [AiController::class, 'analyze']);
        Route::post('/ideas', [AiController::class, 'ideas']);
        Route::post('/hooks', [AiController::class, 'hooks']);
    });
});
