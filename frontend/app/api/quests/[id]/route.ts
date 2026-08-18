import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId } from "@/lib/api/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const quest = db.quests.find((q) => q.id === Number(id));
    if (!quest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (quest.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const body = await req.json();
    if (body.title !== undefined) quest.title = body.title;
    if (body.xp_reward !== undefined) quest.xp_reward = body.xp_reward;
    quest.updated_at = db.now();
    return NextResponse.json({ data: quest });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const idx = db.quests.findIndex((q) => q.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (db.quests[idx].user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    db.quests.splice(idx, 1);
    return NextResponse.json({ data: { id: Number(id) } });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}