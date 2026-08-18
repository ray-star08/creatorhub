import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId } from "@/lib/api/auth";
import { createIdea } from "@/lib/supabase/db";
import { tabiGenerate, tabiToList, mockIdeasList } from "@/lib/api/ai";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topic = (body.topic as string) ?? "content strategy";

    const prompt = `You are a data-driven Trend Analyst & Content Strategist. Respond ONLY in Bahasa Indonesia.
Tugas: Buatkan 5 ide konten viral untuk social media (TikTok/Reels/Shorts) tentang ${topic}.

Kriteria:
- Fokus pada market gap, audience retention, platform algorithm trends, dan contrarian perspectives.
- Bahasa Indonesia yang profesional dan insightful.
- Topik seputar content strategy, data analytics, audience psychology, dan platform growth.
- Singkat, padat, dan menarik.
- Format: Setiap ide berupa satu kalimat tajam, bukan judul generik.
- HANYA LIST IDE SAJA (Tanpa intro/outro).`;

    let list: string[];
    try {
      const result = await tabiGenerate(prompt, 300);
      list = tabiToList(result, 5);
    } catch {
      list = mockIdeasList();
    }

    const savedIdeas = [];
    for (const title of list) {
      const idea = await createIdea({
        user_id: userId,
        title,
        description: null,
        topic: topic,
        engagement_score: null,
      });
      savedIdeas.push(idea);
    }

    return NextResponse.json({ ideas: list, data: savedIdeas });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}