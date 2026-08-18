import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId, getUser } from "@/lib/api/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    const user = getUser(userId);
    if (!user) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const { id } = await params;
    const scheduleId = parseInt(id);
    const idx = db.schedules.findIndex((s) => s.id === scheduleId && s.user_id === userId);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    db.schedules.splice(idx, 1);
    return NextResponse.json({ data: { id: scheduleId } });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}