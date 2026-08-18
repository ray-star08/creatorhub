import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId } from "@/lib/api/auth";
import { getScripts } from "@/lib/supabase/db";

export async function GET(req: NextRequest) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const scripts = await getScripts(userId);
    const mapped = scripts.map((s) => ({
      id: s.id,
      user_id: s.user_id,
      idea_id: s.idea_id,
      title: "",
      hook: s.hook ?? "",
      content: s.main_content ?? "",
      cta: s.cta ?? "",
      created_at: s.created_at,
    }));
    return NextResponse.json({ data: mapped });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}