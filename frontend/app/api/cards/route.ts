import { NextRequest, NextResponse } from "next/server";
import { db, CARD_COLUMNS } from "@/lib/api/db";
import { getUserId } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = CARD_COLUMNS.reduce(
      (acc, col) => {
        acc[col] = db.cards
          .filter((c) => c.user_id === userId && c.column === col)
          .sort((a, b) => a.position - b.position);
        return acc;
      },
      {} as Record<string, typeof db.cards>,
    );
    return NextResponse.json({ data });
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
    const type = body.type ?? "Idea";
    const column = body.column ?? "ideas";
    if (!CARD_COLUMNS.includes(column)) {
      return NextResponse.json({ error: "Invalid column" }, { status: 400 });
    }
    const position = db.cards.filter((c) => c.user_id === userId && c.column === column).length;
    const now = db.now();
    const card = {
      id: db.autoId(),
      user_id: userId,
      title,
      type,
      column,
      position,
      created_at: now,
      updated_at: now,
    };
    db.cards.push(card);
    return NextResponse.json({ data: card }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}