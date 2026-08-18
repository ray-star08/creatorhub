import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";
import { addXp, gamificationPayload } from "@/lib/api/gamification";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const quest = db.quests.find((q) => q.id === Number(id));
    if (!quest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (quest.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (quest.is_completed) {
      return NextResponse.json({
        data: quest,
        gamification: gamificationPayload(user),
        reward: null,
      });
    }
    quest.is_completed = true;
    quest.completed_at = db.now();
    quest.updated_at = db.now();
    const xpResult = addXp(user, quest.xp_reward);
    return NextResponse.json({
      data: quest,
      gamification: gamificationPayload(user),
      reward: xpResult,
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}