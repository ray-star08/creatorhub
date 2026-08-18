import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/api/db";
import { getUserId } from "@/lib/api/auth";

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { niche, platform, audience, style } = body;
    const now = db.now();
    const existing = db.profiles.find((p) => p.user_id === userId);
    if (existing) {
      if (niche !== undefined) existing.niche = niche;
      if (platform !== undefined) existing.platform = platform;
      if (audience !== undefined) existing.audience = audience;
      if (style !== undefined) existing.style = style;
      existing.updated_at = now;
      return NextResponse.json({ data: existing });
    }
    const profile = {
      id: db.autoId(),
      user_id: userId,
      niche: niche ?? null,
      platform: platform ?? null,
      audience: audience ?? null,
      style: style ?? null,
      created_at: now,
      updated_at: now,
    };
    db.profiles.push(profile);
    return NextResponse.json({ data: profile }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}