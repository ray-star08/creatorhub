<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use JsonException;
use RuntimeException;

/**
 * Thin wrapper around Tabi AI, a third-party provider that speaks the standard
 * OpenAI Chat Completions wire format — POST {baseUrl}/chat/completions with a
 * `Bearer {API_KEY}` Authorization header.
 *
 * Config (backend .env, server-side only — never shipped to the browser):
 *   - baseUrl -> TABI_AI_BASE_URL (e.g. https://tabitoken.com/v1)
 *   - apiKey  -> TABI_AI_API_KEY  (sk-...)
 *   - model   -> TABI_AI_MODEL    (e.g. claude-opus-4-8-thinking)
 *
 * Strict JSON is requested via `response_format: json_object` where the upstream
 * supports it, but we still decode defensively — stripping stray markdown fences
 * — and throw a clear error if the reply is not valid JSON.
 */
class TabiAIService
{
    /**
     * @param string[] $backupModels
     */
    public function __construct(
        private readonly string $apiKey,
        private readonly string $baseUrl,
        private readonly string $model,
        private readonly array $backupModels = [],
    ) {}

    /**
     * Send a system + user prompt to Tabi AI and return the decoded JSON object.
     *
     * @return array<string, mixed>
     *
     * @throws RuntimeException when credentials are missing or the API errors.
     */
    public function generateJSON(string $systemPrompt, string $userPrompt): array
    {
        if ($this->apiKey === '' || $this->baseUrl === '' || $this->model === '') {
            throw new RuntimeException(
                'Tabi AI is not configured. Set TABI_AI_API_KEY, TABI_AI_BASE_URL and TABI_AI_MODEL in the backend .env.'
            );
        }

        $url = sprintf('%s/chat/completions', rtrim($this->baseUrl, '/'));

        $response = Http::timeout(60)
            ->withToken($this->apiKey)
            ->acceptJson()
            ->asJson()
            ->post($url, [
                'model' => $this->model,
                'max_tokens' => 2048,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userPrompt],
                ],
            ]);

        if ($response->failed()) {
            $message = $response->json('error.message') ?? $response->reason();

            throw new RuntimeException("Tabi AI error: {$message}");
        }

        // OpenAI Chat Completions returns the text in choices[0].message.content.
        $content = $response->json('choices.0.message.content');

        if (! is_string($content) || trim($content) === '') {
            throw new RuntimeException('Tabi AI returned an empty response.');
        }

        try {
            $decoded = json_decode($this->extractJson($content), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException('Tabi AI did not return valid JSON: '.$e->getMessage());
        }

        if (! is_array($decoded)) {
            throw new RuntimeException('Tabi AI JSON payload was not an object.');
        }

        return $decoded;
    }

    /**
     * Pull the JSON object out of a model reply, tolerating the odd markdown
     * code fence or surrounding prose the model may add despite instructions.
     */
    private function extractJson(string $content): string
    {
        $trimmed = trim($content);

        // Strip a leading ```json / ``` fence and its closing counterpart.
        if (str_starts_with($trimmed, '```')) {
            $trimmed = preg_replace('/^```(?:json)?\s*/i', '', $trimmed);
            $trimmed = preg_replace('/\s*```$/', '', (string) $trimmed);
            $trimmed = trim((string) $trimmed);
        }

        // If there is still surrounding prose, fall back to the outermost
        // object braces.
        if (! str_starts_with($trimmed, '{')) {
            $start = strpos($trimmed, '{');
            $end = strrpos($trimmed, '}');

            if ($start !== false && $end !== false && $end > $start) {
                $trimmed = substr($trimmed, $start, $end - $start + 1);
            }
        }

        return $trimmed;
    }
}
