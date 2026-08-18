import { NextRequest, NextResponse } from "next/server";
import { getSupabaseUserId } from "@/lib/api/auth";
import { deleteScript } from "@/lib/supabase/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getSupabaseUserId(req);
    if (!userId) return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });

    const { id } = await params;
    const scriptId = parseInt(id);
    if (isNaN(scriptId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const deleted = await deleteScript(scriptId, userId);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: { id: scriptId } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}