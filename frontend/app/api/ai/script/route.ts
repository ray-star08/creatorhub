import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId } from "@/lib/api/auth";
import { getIdea, createScript } from "@/lib/supabase/db";
import { tabiGenerate, tabiGenerateJSON, mockScript, mockStructuredScript } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const topic = (body.topic ?? body.ideaTitle) as string;
    const description = (body.description as string) ?? "";
    const niche = (body.niche as string) ?? "general content creation";
    const ideaId = body.idea_id as number | undefined;

    if (!topic || typeof topic !== "string" || topic.length > 500) {
      return NextResponse.json({ error: "Topic is required (max 500 chars)" }, { status: 400 });
    }

    if (ideaId) {
      const idea = await getIdea(ideaId, userId);
      if (!idea) return NextResponse.json({ error: "Idea not found" }, { status: 404 });

      const ideaDescription = idea.description ?? description;
      const ideaTitle = idea.title ?? topic;

      const systemPrompt = "You are a data-driven Content Strategist & Script Writer. Respond ONLY in Bahasa Indonesia with valid JSON.";
      const userPrompt = `Generate a data-backed 3-part video script (Hook, Main Content, CTA) based strictly on this specific idea.
Title: ${ideaTitle}
Description: ${ideaDescription}
Topic: ${idea.topic ?? ""}
Niche: ${niche}

Stay strictly on this topic. Use data, insight, and contrarian perspectives to make the script compelling.
Output JSON only: { "hook": string, "main_content": string, "cta": string }`;

      let result: Record<string, unknown>;
      try {
        result = await tabiGenerateJSON(systemPrompt, userPrompt, 600);
      } catch {
        result = mockStructuredScript() as unknown as Record<string, unknown>;
      }

      const script = await createScript({
        user_id: userId,
        idea_id: ideaId,
        hook: (result.hook as string) ?? "",
        main_content: (result.main_content as string) ?? (result.content as string) ?? "",
        cta: (result.cta as string) ?? "",
      });

      return NextResponse.json({
        data: {
          id: script.id,
          user_id: script.user_id,
          idea_id: script.idea_id,
          title: ideaTitle,
          hook: script.hook ?? "",
          content: script.main_content ?? "",
          cta: script.cta ?? "",
          created_at: script.created_at,
        },
      }, { status: 201 });
    }

    const prompt = `You are a data-driven Content Strategist & Script Writer. Respond ONLY in Bahasa Indonesia.

Generate a 3-part video script (Hook, Main Content, CTA) based strictly on this specific idea:
Title: ${topic}
Description: ${description || "(no description)"}
Niche: ${niche}

Bahasa: Indonesia (Gaul, Santai, Engaging). Jangan gunakan bahasa lain.
Tetap fokus pada topik di atas — jangan keluar konteks.
Gunakan data, insight, dan sudut pandang contrarian untuk membuat script lebih compelling.

Format Output:
Berikan output terstruktur rapi dengan format markdown:

**🔥 HOOK**
[Tulis hook data-driven yang kuat — gunakan angka atau insight mengejutkan]

**📝 INTRO SINGKAT**
[Tulis intro yang membangun kredibilitas dengan data atau pengalaman]

**💡 POIN UTAMA**
* [Poin 1 — backed by data atau insight spesifik]
* [Poin 2 — backed by data atau insight spesifik]
* [Poin 3 — backed by data atau insight spesifik]

**📢 CALL TO ACTION**
[Tulis ajakan bertindak yang spesifik dan actionable]`;

    let result: string;
    try {
      result = await tabiGenerate(prompt, 600);
    } catch {
      result = mockScript();
    }

    return NextResponse.json({ script: result });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}