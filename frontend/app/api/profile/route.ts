import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = db.profiles.find((p) => p.user_id === userId) ?? null;
    return NextResponse.json({ data: profile });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}