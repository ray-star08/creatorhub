import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { db, tokens } from "@/lib/api/db";
import { userPayload, seedStarterQuests } from "@/lib/api/gamification";
import { TOKEN_KEY } from "@/lib/auth-token";

const DEMO_PASSWORD = "DemoPassw0rd!2026";

export async function POST(_req: NextRequest) {
  try {
    const email = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@creatorhub.app`;
    const name = `Demo Judge ${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const adminClient = createAdminClient();
    const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { name },
    });

    if (adminError || !adminData.user) {
      console.error("demo create user failed:", adminError);
      return NextResponse.json({ message: adminError?.message ?? "Demo registration failed" }, { status: 400 });
    }

    const supabase = await createClient();
    // retry on Supabase rate limit (429) — many simultaneous demo clicks from one IP
    type SignInResult = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
    let signInData: SignInResult["data"] | undefined;
    let signInError: SignInResult["error"] | undefined;
    let rateLimited = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      ({ data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: DEMO_PASSWORD,
      }));
      if (!signInError) break;
      rateLimited = signInError.status === 429 || /rate|too many/i.test(signInError.message);
      if (!rateLimited) break;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }

    if (signInError || !signInData?.session) {
      console.error("demo sign-in failed:", signInError);
      return NextResponse.json({ message: "Server is busy — please try again in a moment." }, { status: rateLimited ? 429 : 500 });
    }

    const now = db.now();
    const user = {
      id: db.autoId(),
      supabase_id: adminData.user.id,
      name,
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
    seedStarterQuests(user.id);

    // fully onboarded — bypasses /setup
    db.profiles.push({
      id: db.autoId(),
      user_id: user.id,
      niche: "Tech & Productivity",
      platform: "TikTok",
      audience: "Curious creators who love practical tips",
      style: "Educational",
      created_at: now,
      updated_at: now,
    });

    const token = signInData.session.access_token;
    tokens.set(token, user.id);

    const response = NextResponse.json({ user: userPayload(user), token }, { status: 201 });
    response.cookies.set(TOKEN_KEY, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (e) {
    console.error("demo error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
