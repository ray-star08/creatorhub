import { NextRequest, NextResponse } from "next/server";
import { db, STATUS_TO_COLUMN, COLUMN_TO_STATUS, MOVE_REWARDS, DEFAULT_MOVE_REWARD } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";
import { addXp, gamificationPayload } from "@/lib/api/gamification";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const { id } = await params;
    const cardId = parseInt(id);
    const card = db.cards.find((c) => c.id === cardId && c.user_id === userId);
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { status } = await req.json();
    if (!status || !(status in STATUS_TO_COLUMN)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const oldColumn = card.column;
    const newColumn = STATUS_TO_COLUMN[status];
    const columnChanged = oldColumn !== newColumn;

    let xpResult = null;
    if (columnChanged) {
      const reward = MOVE_REWARDS[newColumn] ?? DEFAULT_MOVE_REWARD;
      xpResult = addXp(user, reward);
    }

    card.column = newColumn;
    card.updated_at = db.now();

    const taskStatus = COLUMN_TO_STATUS[newColumn];

    return NextResponse.json({
      data: {
        id: card.id,
        user_id: card.user_id,
        title: card.title,
        status: taskStatus,
        created_at: card.created_at,
        updated_at: card.updated_at,
      },
      ...(xpResult && { gamification: gamificationPayload(user), reward: xpResult }),
    });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}