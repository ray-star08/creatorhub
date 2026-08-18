import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId, getUserBySupabaseId } from "@/lib/api/auth";
import { getIdeas, createIdea } from "@/lib/supabase/db";
import { addXp, gamificationPayload } from "@/lib/api/gamification";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const ideas = await getIdeas(userId);
    return NextResponse.json({ data: ideas });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const body = await req.json();
    const { content, source } = body;
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    const idea = await createIdea({
      user_id: userId,
      title: (content as string).slice(0, 200),
      description: content as string,
      topic: null,
      engagement_score: null,
    });

    const inMemoryUser = getUserBySupabaseId(userId);
    if (inMemoryUser) {
      const xpResult = addXp(inMemoryUser, 10);
      return NextResponse.json(
        { data: idea, gamification: gamificationPayload(inMemoryUser), reward: xpResult },
        { status: 201 },
      );
    }

    return NextResponse.json({ data: idea }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}