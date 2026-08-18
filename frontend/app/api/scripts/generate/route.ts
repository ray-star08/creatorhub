import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId } from "@/lib/api/auth";
import { getIdea, createScript } from "@/lib/supabase/db";
import { tabiGenerateJSON, mockStructuredScript } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const ideaId = body.idea_id as number;
    const tone = (body.tone as string) ?? "energetic and casual";
    const duration = (body.duration as string) ?? "60 seconds";

    if (!ideaId) {
      return NextResponse.json({ error: "idea_id is required" }, { status: 400 });
    }

    const idea = await getIdea(ideaId, userId);
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const description = idea.description ?? "(no description provided)";
    const title = idea.title ?? "";

    const systemPrompt = "You are a data-driven Content Strategist & Script Writer. Respond ONLY in Bahasa Indonesia with valid JSON.";
    const userPrompt = `Generate a data-backed 3-part video script (Hook, Main Content, CTA) based strictly on this specific idea.
Title: ${title}
Description: ${description}
Topic: ${idea.topic ?? ""}
Tone: ${tone}
Duration: ${duration}

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

    const mapped = {
      id: script.id,
      user_id: script.user_id,
      idea_id: script.idea_id,
      title: title,
      hook: script.hook ?? "",
      content: script.main_content ?? "",
      cta: script.cta ?? "",
      created_at: script.created_at,
    };

    return NextResponse.json({ data: mapped }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}