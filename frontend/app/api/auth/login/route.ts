import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db, tokens } from "@/lib/api/db";
import { userPayload, seedStarterQuests } from "@/lib/api/gamification";
import { TOKEN_KEY } from "@/lib/auth-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        return NextResponse.json(
          { message: "Email not confirmed. Please check your inbox or try registering again." },
          { status: 401 },
        );
      }
      if (error.message.includes("Invalid login credentials")) {
        return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
      }
      return NextResponse.json({ message: error.message }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const sbUser = data.user;
    let user = db.users.find((u) => u.email === email);

    if (!user) {
      const now = db.now();
      user = {
        id: db.autoId(),
        supabase_id: sbUser.id,
        name: sbUser.user_metadata?.name ?? email.split("@")[0],
        email: sbUser.email ?? email,
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
      seedStarterQuests(user.id);
    } else if (!user.supabase_id) {
      user.supabase_id = sbUser.id;
    }

    const token = data.session.access_token;
    tokens.set(token, user.id);

    const response = NextResponse.json({ user: userPayload(user), token });
    response.cookies.set(TOKEN_KEY, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (e) {
    console.error("login error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}