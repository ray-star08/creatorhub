<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Thin wrapper around the Google Gemini `generateContent` endpoint.
 *
 * This is the *only* place the API key is ever touched. The key lives in the
 * backend .env (never shipped to the browser), so the frontend calls our own
 * /api/ai/* routes and we proxy to Gemini here. Ported from the static
 * `callGemini()` helper in dashboard.html.
 */
class GeminiService
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
        private readonly string $baseUrl,
    ) {
    }

    /**
     * Send a single-turn prompt to Gemini and return the plain-text response.
     *
     * @throws RuntimeException when the key is missing or the API errors out.
     */
    public function generate(string $prompt): string
    {
        if ($this->apiKey === '') {
            throw new RuntimeException('Gemini API key is not configured. Set GEMINI_API_KEY in the backend .env.');
        }

        $endpoint = sprintf('%s/models/%s:generateContent', rtrim($this->baseUrl, '/'), $this->model);

        $response = Http::timeout(45)
            ->withHeaders(['x-goog-api-key' => $this->apiKey])
            ->acceptJson()
            ->post($endpoint, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]],
                ],
            ]);

        if ($response->failed()) {
            $message = $response->json('error.message') ?? $response->reason();

            throw new RuntimeException("Gemini API error: {$message}");
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('Gemini returned an empty response.');
        }

        return trim($text);
    }

    /**
     * Split a list-style Gemini response into clean, de-numbered lines.
     *
     * @return array<int, string>
     */
    public function toList(string $text, int $limit = 6): array
    {
        $lines = collect(preg_split('/\r\n|\r|\n/', $text))
            ->map(fn (string $line) => trim($line))
            ->filter(fn (string $line) => $line !== '')
            // Strip leading bullets / numbering (e.g. "1.", "-", "*").
            ->map(fn (string $line) => preg_replace('/^\s*(?:\d+[\.\)]|[-*•])\s*/u', '', $line))
            ->map(fn (string $line) => trim($line, " \"'"))
            ->filter(fn (string $line) => $line !== '')
            ->take($limit)
            ->values();

        return $lines->all();
    }
}
