/**
 * AI service wrappers — Tabi/Autoapp (primary, glm-5.3), Gemini + OpenRouter (optional backups).
 * All providers use OpenAI-compatible /chat/completions, so one call path covers them all.
 * Calls upstream API server-side. Falls back to mock data on any failure.
 */

const TABI_API_KEY = process.env.TABI_AI_API_KEY ?? "sk-qwen-0c4b9916dd9a44e06fdec993d432c93bcbfd055924b43014";
const TABI_BASE_URL = process.env.TABI_AI_BASE_URL ?? "https://ai.autoapp.biz.id/v1";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? "";

function splitList(v: string | undefined): string[] {
  return (v ?? "").split(",").map((m) => m.trim()).filter(Boolean);
}

interface Provider {
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
}

// ponytail: provider order = priority; add a new provider by appending one entry here.
const PROVIDERS: Provider[] = [
  {
    name: "tabi",
    baseUrl: TABI_BASE_URL,
    apiKey: TABI_API_KEY,
    models: splitList(process.env.TABI_AI_MODEL ?? "glm-5.3").concat(splitList(process.env.TABI_AI_BACKUP_MODELS)),
  },
  {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: GEMINI_API_KEY,
    models: splitList(process.env.GEMINI_MODELS ?? "gemini-2.5-flash,gemini-2.0-flash"),
  },
  {
    name: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: OPENROUTER_API_KEY,
    models: splitList(process.env.OPENROUTER_MODELS ?? "google/gemini-2.0-flash-001"),
  },
];

function activeProviders(): Provider[] {
  return PROVIDERS.filter((p) => p.apiKey && p.models.length > 0);
}

export function hasLiveProvider(): boolean {
  return activeProviders().length > 0;
}

const AI_TIMEOUT_MS = 15_000;

// ---- JSON / text generation (provider-agnostic) ----
// Note: names kept as "tabi*" for backwards compatibility with existing routes.

export async function tabiGenerateJSON(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 600,
): Promise<Record<string, unknown>> {
  const errors: string[] = [];

  for (const provider of activeProviders()) {
    for (const model of provider.models) {
      try {
        const text = await callModel(provider, model, systemPrompt, userPrompt, maxTokens, true);
        return JSON.parse(extractJson(text));
      } catch (e) {
        errors.push(`${provider.name}/${model}: ${(e as Error).message}`);
      }
    }
  }

  throw new Error("All models failed. " + errors.join(" | "));
}

export async function tabiTryModel(
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<Record<string, unknown>> {
  const errors: string[] = [];

  for (const provider of activeProviders()) {
    try {
      const text = await callModel(provider, model, systemPrompt, userPrompt, 300, true);
      return JSON.parse(extractJson(text));
    } catch (e) {
      errors.push(`${provider.name}: ${(e as Error).message}`);
    }
  }

  throw new Error("All models failed. " + errors.join(" | "));
}

// Plain-text generation via the provider chain.
export async function tabiGenerate(prompt: string, maxTokens = 300): Promise<string> {
  const errors: string[] = [];

  for (const provider of activeProviders()) {
    for (const model of provider.models) {
      try {
        return await callModel(provider, model, "You are a helpful assistant.", prompt, maxTokens, false);
      } catch (e) {
        errors.push(`${provider.name}/${model}: ${(e as Error).message}`);
      }
    }
  }

  throw new Error("All models failed. " + errors.join(" | "));
}

async function callModel(
  provider: Provider,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number,
  jsonMode: boolean,
): Promise<string> {
  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });

  if (res.status === 429) {
    throw new Error("Rate limited");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? res.statusText ?? "Unknown error");
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content;

  if (!text || !text.trim()) throw new Error("Empty response from AI");

  return text;
}

function extractJson(text: string): string {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  if (!trimmed.startsWith("{")) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      trimmed = trimmed.slice(start, end + 1);
    }
  }
  return trimmed;
}

// ---- Text list helper ----

export function tabiToList(text: string, limit = 6): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[\d]+[.)\s]+/, "").replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 3)
    .slice(0, limit);
}

// ---- Mock fallbacks (pitch-safe) ----

export function mockIdeasList(): string[] {
  return [
    "Analisis Retention: Mengapa Visual Hook Dalam 2 Detik Pertama Jadi Kunci FYP Sekarang",
    "Content Gap Strategy: Membedah Sisi Unik yang Belum Disentuh Kreator Lain di Niche Ini",
    "Algorithmic Trend: Format Storytelling Data-Driven yang Sedang Naik Daun di TikTok/Reels",
    "Validasi Ide dengan Data: Cara Gunakan Analytics Tools Sebelum Mulai Produksi Konten",
    "Audience Psychology: Pola Konsumsi Konten Gen Z yang Berubah dan Cara Adaptasinya",
  ];
}

export function mockHooksList(): string[] {
  return [
    "Data ini bikin gue mikir ulang semua strategi konten gue...",
    "80% kreator gagal di sini — lo jangan jadi salah satunya",
    "Stop nebak-nebak! Ini cara validasi ide konten pakai data beneran",
    "Pattern interrupt yang ningkatin retention rate sampe 2x lipat",
    "Satu insight ini ngubah total cara gue bikin konten",
    "Aku analisa 100 video viral — ini 3 pola yang selalu muncul",
  ];
}

export function mockScript(_topic?: string): string {
  return [
    "**🔥 HOOK**",
    "80% kreator gagal bukan karena konten jelek — tapi karena gak ngerti data retention.",
    "",
    "**📝 INTRO SINGKAT**",
    "Hari ini kita bedah 3 metrik retention paling underrated. Data real, bukan feeling.",
    "",
    "**💡 POIN UTAMA**",
    "* Retention rate di 3 detik pertama nentuin 90% algoritma reach — jangan buang waktu dengan intro panjang",
    "* Pattern interrupt tiap 5-7 detik bisa ningkatin watch time sampai 2x lipat — ganti angle, zoom, atau text overlay",
    "* Call to action di timing yang tepat naikin conversion rate 3x lebih tinggi dibanding CTA di akhir video",
    "",
    "**📢 CALL TO ACTION**",
    "Follow buat data-driven content tips tiap minggu. Drop topik yang lo pengen gue analisa selanjutnya!",
  ].join("\n");
}

export function mockAnalysis(): string {
  return [
    "- Viral Probability: 78%",
    "- Retention Score: High",
    "- Hook Strength: Strong",
    "- Content Gap Score: 85/100",
  ].join("\n");
}

// ponytail: mock IDs = timestamp + seq; unique per process, upgrade path = real DB ids from Supabase insert
let mockIdSeq = 0;
function nextMockId(): number {
  return Date.now() + (mockIdSeq++ % 1000);
}

// ponytail: mock fallback — template-based by design (no AI); upgrade path = fix provider keys.
// Titles embed a properly-cased topic so they read as natural Indonesian, never "[Prefix] topic [Suffix]".

const LOWERcase_WORDS = new Set([
  "dan", "atau", "di", "ke", "dari", "untuk", "pada", "dengan", "yang", "ini",
  "itu", "apa", "cara", "gak", "nggak",
]);

function titleCaseId(topic: string): string {
  return topic
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (i > 0 && LOWERcase_WORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function mockStructuredIdeas(topic?: string): Array<{
  id: number;
  title: string;
  description: string;
  engagement_score: number;
}> {
  const clean = (topic ?? "").trim() || "konten kreator pemula";
  const T = titleCaseId(clean);
  const topicLower = clean.toLowerCase();

  // [title, description, score, avoidKeyword?] — skip a pattern when the topic
  // already contains its keyword, so titles never repeat words like "pemula pemula".
  const patterns: Array<[string, string, number] | [string, string, number, string]> = [
    [
      `Mitos vs Fakta: Yang Sering Disalahpahami Seputar ${T}`,
      `Banyak anggapan keliru yang terus dipercaya orang. Video ini membongkar tiga fakta penting seputar ${topicLower} dengan gaya santai, disertai contoh nyata biar penonton langsung paham bedanya mitos dan kenyataan.`,
      91,
    ],
    [
      `3 Kesalahan Pemula Saat Mulai Belajar ${T}`,
      `Kesalahan kecil sering bikin hasil jadi jauh dari ekspektasi. Di sini dibahas tiga mistake paling umum, kenapa itu terjadi, dan langkah perbaikan yang bisa langsung dipraktikkan hari ini juga.`,
      87,
      "pemula",
    ],
    [
      `Eksperimen 30 Hari: Apa yang Terjadi Kalau Fokus di ${T}`,
      `Dokumentasi perjalanan 30 hari secara jujur, lengkap dengan data perkembangan tiap minggu. Cocok buat penonton yang penasaran apakah konsistensi benar-benar membawa perubahan signifikan.`,
      94,
    ],
    [
      `Kenapa ${T} Tiba-Tiba Jadi Perbincangan Banyak Orang`,
      `Ulasan mendalam soal momentum yang bikin topik ini naik daun: pemicunya, siapa yang mempopulerkan, dan seberapa lama tren ini diperkirakan bertahan sebelum terlalu ramai.`,
      89,
    ],
    [
      `Yang Gue Pelajari Setelah 200 Jam Mendalami ${T}`,
      `Ringkasan insight paling berharga dari proses belajar panjang. Tiga pola yang selalu berulang, dua hal yang ternyata overrated, dan satu temuan yang cukup mengejutkan.`,
      86,
    ],
    [
      `Panduan Lengkap ${T} untuk Pemula, Dari Nol`,
      `Panduan bertahap yang mudah diikuti bahkan oleh yang baru mulai. Setiap langkah dijelaskan singkat, padat, dengan contoh konkret sehingga tidak ada rasa bingung saat mempraktikkannya.`,
      79,
      "pemula",
    ],
    [
      `Review Jujur: Apakah ${T} Seperti yang Dikatakan Orang?`,
      `Review jujur dari sudut pandang pengguna langsung. Ada yang benar-benar worth it, ada juga yang hanya bagus di teori. Dilengkapi pertimbangan biaya, waktu, dan hasil nyata.`,
      84,
      "review",
    ],
    [
      `Perbandingan Pendekatan: Mana yang Paling Cocok untuk ${T}`,
      `Bedah kelebihan dan kekurangan tiap pendekatan secara adat, disertai data perbandingan agar penonton bisa menentukan pilihan paling sesuai dengan kondisi dan tujuan mereka masing-masing.`,
      85,
    ],
    [
      `Studi Kasus: Hasil Nyata Setelah Menerapkan ${T}`,
      `Kisah lengkap dari awal sampai hasil akhir, termasuk hambatan yang dihadapi dan cara mengatasinya. Penonton bisa menilai sendiri apakah metode ini relevan dengan situasi mereka.`,
      90,
      "studi kasus",
    ],
    [
      `Pertanyaan yang Sering Muncul Soal ${T}, Akhirnya Dijawab`,
      `Kumpulan pertanyaan paling sering ditanyakan, dijawab langsung tanpa bertele-tele. Format tanya-jawab seperti ini gampang ditonton sampai habis karena tiap segmen singkat dan padat.`,
      83,
    ],
    [
      `Kesalahan Kecil yang Bikin ${T} Terasa Sulit Padahal Tidak`,
      `Sering bukan materinya yang susah, tapi cara memulainya yang salah. Video ini menunjukkan penyesuaian kecil yang membuat proses belajar terasa jauh lebih ringan dan menyenangkan.`,
      88,
    ],
    [
      `Satu Perubahan Kecil di ${T} yang Dampaknya Besar`,
      `Terkadang satu penyesuaian sederhana mengubah hasil secara drastis. Diulas secara spesifik: apa yang diubah, kenapa berhasil, dan bagaimana penonton bisa menerapkannya langsung.`,
      92,
    ],
  ];

  const usable = patterns.filter(
    (p) => !p[3] || !topicLower.includes(p[3] as string),
  );
  const shuffled = usable.sort(() => Math.random() - 0.5).slice(0, 5);
  return shuffled.map(([title, description, score]) => ({
    id: nextMockId(),
    title: title as string,
    description: description as string,
    engagement_score: score as number,
  }));
}

export function mockStructuredScript(): {
  title: string;
  hook: string;
  content: string;
  cta: string;
} {
  return {
    title: "3 Metrik Retention yang Bikin Konten Lo FYP",
    hook: "80% kreator gagal bukan karena konten jelek — tapi karena gak ngerti data retention! 🔥",
    content: "**🔥 HOOK**\n80% kreator gagal bukan karena konten jelek — tapi karena gak ngerti data retention.\n\n**📝 INTRO SINGKAT**\nHari ini kita bedah 3 metrik retention yang paling underrated. Data real, bukan feeling.\n\n**💡 POIN UTAMA**\n* Retention rate di 3 detik pertama nentuin 90% algoritma reach — jangan buang waktu dengan intro panjang\n* Pattern interrupt tiap 5-7 detik bisa ningkatin watch time sampai 2x lipat — ganti angle, zoom, atau text overlay\n* Call to action di timing yang tepat naikin conversion rate 3x lebih tinggi dibanding CTA di akhir video\n\n**📢 CALL TO ACTION**\nFollow buat data-driven content tips tiap minggu. Drop topik yang lo pengen gue analisa selanjutnya!",
    cta: "Follow buat data-driven content tips tiap minggu. Drop topik yang lo pengen gue analisa selanjutnya!",
  };
}