import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ data: db.quests.filter((q) => q.user_id === userId) });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const title = body.title;
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    const xp_reward = body.xp_reward ?? 10;
    const now = db.now();
    const quest = {
      id: db.autoId(),
      user_id: userId,
      title,
      xp_reward,
      is_completed: false,
      completed_at: null,
      created_at: now,
      updated_at: now,
    };
    db.quests.push(quest);
    return NextResponse.json({ data: quest }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}