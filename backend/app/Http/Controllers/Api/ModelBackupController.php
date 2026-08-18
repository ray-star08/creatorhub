<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AI\TabiAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class ModelBackupController extends Controller
{
    public function __construct(private readonly TabiAIService $ai) {}

    public function models(): JsonResponse
    {
        $config = config('services.tabi');

        return response()->json([
            'data' => [
                'base_url' => $config['base_url'],
                'primary' => $config['model'],
                'backups' => $config['backup_models'],
                'all' => array_merge([$config['model']], $config['backup_models']),
            ],
        ]);
    }

    public function test(Request $request): JsonResponse
    {
        $data = $request->validate([
            'model' => ['required', 'string'],
        ]);

        $start = microtime(true);

        try {
            $result = $this->ai->tryModel(
                model: $data['model'],
                systemPrompt: 'You are a helpful assistant. Reply with valid JSON only.',
                userPrompt: 'Reply with {"status":"ok"}',
            );

            $elapsed = round((microtime(true) - $start) * 1000);

            return response()->json([
                'data' => [
                    'model' => $data['model'],
                    'status' => 'ok',
                    'latency_ms' => $elapsed,
                    'response' => $result,
                ],
            ]);
        } catch (RuntimeException $e) {
            return response()->json([
                'data' => [
                    'model' => $data['model'],
                    'status' => 'error',
                    'error' => $e->getMessage(),
                ],
            ], 502);
        }
    }
}