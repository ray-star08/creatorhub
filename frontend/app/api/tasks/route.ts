import { NextRequest, NextResponse } from "next/server";
import { db, COLUMN_TO_STATUS, STATUS_TO_COLUMN } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const tasks = db.cards
      .filter((c) => c.user_id === userId)
      .map((c) => ({
        id: c.id,
        user_id: c.user_id,
        title: c.title,
        status: COLUMN_TO_STATUS[c.column] ?? "idea",
        created_at: c.created_at,
        updated_at: c.updated_at,
      }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return NextResponse.json({ data: tasks });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const { title, status } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const taskStatus = (status as string) ?? "idea";
    const column = STATUS_TO_COLUMN[taskStatus] ?? "ideas";
    const position = db.cards.filter((c) => c.user_id === userId && c.column === column).length;
    const now = db.now();

    const card = {
      id: db.autoId(),
      user_id: userId,
      title: title as string,
      type: "task",
      column,
      position,
      created_at: now,
      updated_at: now,
    };
    db.cards.push(card);

    return NextResponse.json(
      {
        data: {
          id: card.id,
          user_id: card.user_id,
          title: card.title,
          status: taskStatus,
          created_at: card.created_at,
          updated_at: card.updated_at,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}