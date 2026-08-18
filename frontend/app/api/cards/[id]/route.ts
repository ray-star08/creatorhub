import { NextRequest, NextResponse } from "next/server";
import { db, MOVE_REWARDS, DEFAULT_MOVE_REWARD } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";
import { addXp, gamificationPayload } from "@/lib/api/gamification";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const card = db.cards.find((c) => c.id === Number(id));
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (card.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    if (body.title !== undefined) card.title = body.title;
    if (body.type !== undefined) card.type = body.type;
    const prevColumn = card.column;
    if (body.column !== undefined) card.column = body.column;
    card.updated_at = db.now();
    if (body.column !== undefined && body.column !== prevColumn) {
      const user = getUser(userId);
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const xpReward = MOVE_REWARDS[body.column] ?? DEFAULT_MOVE_REWARD;
      const xpResult = addXp(user, xpReward);
      return NextResponse.json({
        data: card,
        gamification: gamificationPayload(user),
        reward: xpResult,
      });
    }
    return NextResponse.json({ data: card });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const idx = db.cards.findIndex((c) => c.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (db.cards[idx].user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    db.cards.splice(idx, 1);
    return NextResponse.json({ data: { id: Number(id) } });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}