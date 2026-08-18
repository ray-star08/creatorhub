import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db, tokens } from "@/lib/api/db";
import { userPayload } from "@/lib/api/gamification";
import { TOKEN_KEY } from "@/lib/auth-token";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const email = data.user.email;
    if (!email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    let user = db.users.find((u) => u.email === email);

    if (!user) {
      const now = db.now();
      user = {
        id: db.autoId(),
        supabase_id: data.user.id,
        name: data.user.user_metadata?.name ?? email.split("@")[0],
        email,
        password: "",
        level: 1,
        xp: 0,
        next_level_xp: 100,
        title: "Aspiring Creator",
        momentum: 0,
        streak: 0,
        created_at: now,
        updated_at: now,
      };
      db.users.push(user);
    } else if (!user.supabase_id) {
      user.supabase_id = data.user.id;
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.cookies.get(TOKEN_KEY)?.value ?? null;

    if (token) {
      tokens.set(token, user.id);
    }

    return NextResponse.json({ user: userPayload(user) });
  } catch (e) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}