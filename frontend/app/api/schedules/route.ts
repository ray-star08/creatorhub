import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const schedules = db.schedules
      .filter((s) => s.user_id === userId)
      .sort((a, b) => a.publish_date.localeCompare(b.publish_date));

    return NextResponse.json({ data: schedules });
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

    const { title, publish_date } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
    if (!publish_date) return NextResponse.json({ error: "Publish date is required" }, { status: 400 });

    const now = db.now();
    const schedule = {
      id: db.autoId(),
      user_id: userId,
      title: title as string,
      publish_date: publish_date as string,
      created_at: now,
      updated_at: now,
    };
    db.schedules.push(schedule);

    return NextResponse.json({ data: schedule }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}