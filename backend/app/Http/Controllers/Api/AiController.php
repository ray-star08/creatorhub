<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

/**
 * Secure proxy for every AI feature. The frontend never sees the Gemini key —
 * it POSTs a topic/script here and we build the prompt + call Gemini server-side.
 *
 * Prompts are ported verbatim from dashboard.html (intentionally Bahasa
 * Indonesia output) so the migrated app produces identical results.
 */
class AiController extends Controller
{
    public function __construct(private readonly GeminiService $gemini) {}

    /**
     * Generate a viral short-form video script for a topic. (`generateScript`)
     */
    public function script(Request $request): JsonResponse
    {
        $data = $request->validate([
            'topic' => ['required', 'string', 'max:500'],
        ]);

        $prompt = <<<PROMPT
        You are an Indonesian content creator assistant. Respond ONLY in Bahasa Indonesia.
        Topik: "{$data['topic']}"

        Tugas: Buatkan naskah video pendek (TikTok/Reels/Shorts) yang viral.
        Bahasa: Indonesia (Gaul, Santai, Engaging). Jangan gunakan bahasa lain selain Indonesia.

        Format Output:
        Berikan output terstruktur rapi dengan format markdown:

        **🔥 HOOK**
        [Tulis 1 kalimat pembuka yang kuat di sini]

        **📝 INTRO SINGKAT**
        [Tulis intro di sini]

        **💡 POIN UTAMA**
        * [Poin 1]
        * [Poin 2]
        * [Poin 3]

        **📢 CALL TO ACTION**
        [Tulis ajakan bertindak di sini]
        PROMPT;

        return $this->respond(fn () => ['script' => $this->gemini->generate($prompt)]);
    }

    /**
     * Analyse a script and score its viral mechanics. (`saveScriptToPipeline`)
     */
    public function analyze(Request $request): JsonResponse
    {
        $data = $request->validate([
            'script' => ['required', 'string', 'max:5000'],
        ]);

        $prompt = <<<PROMPT
        You are an Indonesian content creator assistant. Respond ONLY in Bahasa Indonesia.
        Tugas: Analisa script video berikut dan beri penilaian.

        Script:
        {$data['script']}

        Output Format (Wajib Bahasa Indonesia untuk penjelasannya):
        - Viral Probability: XX%
        - Retention Score: Low/Medium/High
        - Hook Strength: Weak/Good/Strong
        PROMPT;

        return $this->respond(fn () => ['analysis' => $this->gemini->generate($prompt)]);
    }

    /**
     * Brainstorm 5 viral content ideas. (`generateIdeas`)
     */
    public function ideas(Request $request): JsonResponse
    {
        $prompt = <<<'PROMPT'
        You are an Indonesian content creator assistant. Respond ONLY in Bahasa Indonesia.
        Tugas: Buatkan 5 ide konten viral untuk social media (TikTok/Reels/Shorts).

        Kriteria:
        - Bahasa Indonesia yang santai.
        - Topik seputar produktivitas, AI, atau kehidupan kreator.
        - Singkat, padat, dan menarik.
        - HANYA LIST IDE SAJA (Tanpa intro/outro).
        PROMPT;

        return $this->respond(function () use ($prompt) {
            $text = $this->gemini->generate($prompt);

            return ['ideas' => $this->gemini->toList($text, 5)];
        });
    }

    /**
     * Generate 6 viral opening hooks. (`generateHooks`)
     */
    public function hooks(Request $request): JsonResponse
    {
        $prompt = <<<'PROMPT'
        You are an Indonesian content creator assistant. Respond ONLY in Bahasa Indonesia.
        Tugas: Buatkan 6 hook pembuka video yang sangat viral.

        Kriteria:
        - Bahasa Indonesia.
        - Gaya dramatis atau bikin penasaran (Clickbait yang elegan).
        - Topik: Content Creation, AI, Productivity.
        - HANYA LIST HOOK SAJA.
        PROMPT;

        return $this->respond(function () use ($prompt) {
            $text = $this->gemini->generate($prompt);

            return ['hooks' => $this->gemini->toList($text, 6)];
        });
    }

    /**
     * Run a Gemini-backed closure and normalise error handling to a 502.
     *
     * @param  callable():array<string, mixed>  $callback
     */
    private function respond(callable $callback): JsonResponse
    {
        try {
            return response()->json($callback());
        } catch (RuntimeException $e) {
            return response()->json([
                'message' => 'The AI service is unavailable right now.',
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
