import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tokens } from "@/lib/api/db";
import { TOKEN_KEY } from "@/lib/auth-token";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const token = req.headers.get("authorization")?.replace("Bearer ", "")
      ?? req.cookies.get(TOKEN_KEY)?.value;

    if (token) {
      tokens.delete(token);
    }

    const response = NextResponse.json({ success: true, message: "Logout successful" });
    response.cookies.set(TOKEN_KEY, "", { path: "/", maxAge: 0 });
    return response;
  } catch (e) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}