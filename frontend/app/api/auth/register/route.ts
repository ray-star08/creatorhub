import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { db, tokens } from "@/lib/api/db";
import { userPayload, seedStarterQuests } from "@/lib/api/gamification";
import { TOKEN_KEY } from "@/lib/auth-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, password_confirmation } = body;

    const errors: Record<string, string> = {};

    if (!name || name.length < 2) {
      errors.name = "Name is required and must be at least 2 characters";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (password !== password_confirmation) {
      errors.password_confirmation = "Password confirmation does not match";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 422 });
    }

    const adminClient = createAdminClient();
    const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (adminError) {
      if (adminError.message.includes("already been registered") || adminError.message.includes("already exists")) {
        return NextResponse.json(
          { message: "Validation failed", errors: { email: "Email is already taken" } },
          { status: 422 },
        );
      }
      return NextResponse.json({ message: adminError.message }, { status: 400 });
    }

    const sbUser = adminData.user;
    if (!sbUser) {
      return NextResponse.json({ message: "Registration failed" }, { status: 500 });
    }

    const supabase = await createClient();
    // retry on Supabase rate limit (429) — many simultaneous sign-ups from one IP
    type SignInResult = Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
    let signInData: SignInResult["data"] | undefined;
    let signInError: SignInResult["error"] | undefined;
    let rateLimited = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      ({ data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      }));
      if (!signInError) break;
      rateLimited = signInError.status === 429 || /rate|too many/i.test(signInError.message);
      if (!rateLimited) break;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }

    if (signInError || !signInData?.session) {
      if (rateLimited) {
        return NextResponse.json(
          { message: "Account created! Server is busy — please sign in now." },
          { status: 429 },
        );
      }
      console.error("register sign-in failed:", signInError);
      return NextResponse.json({ message: "Account created but login failed. Please try signing in." }, { status: 500 });
    }

    const now = db.now();
    const user = {
      id: db.autoId(),
      supabase_id: sbUser.id,
      name,
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
    console.error("register error:", e);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}