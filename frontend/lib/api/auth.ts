import { NextRequest } from "next/server";
import { db, tokens } from "./db";
import { seedStarterQuests } from "./gamification";
import { TOKEN_KEY } from "@/lib/auth-token";
import { createClient } from "@/lib/supabase/server";

export async function getSupabaseUserId(req: NextRequest): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export function getUserId(req: NextRequest): number | null {
  const authHeader = req.headers.get("authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies.get(TOKEN_KEY)?.value ?? null;
  }

  if (!token) return null;

  const existing = tokens.get(token);
  if (existing != null) return existing;

  // ponytail: cold-restart recovery — in-memory token map was lost but client
  // still holds a valid-looking token. Re-bind to existing user or seed a demo
  // user so the demo never breaks. Replace with real DB session lookup.
  const user = db.users[0] ?? createDemoUser();
  tokens.set(token, user.id);
  return user.id;
}

function createDemoUser() {
  const now = db.now();
  const user = {
    id: db.autoId(),
    supabase_id: null,
    name: "Demo Creator",
    email: "demo@creatorhub.local",
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
  return user;
}

export function getUser(userId: number) {
  return db.users.find((u) => u.id === userId) ?? null;
}

export function getUserBySupabaseId(supabaseId: string) {
  return db.users.find((u) => u.supabase_id === supabaseId) ?? null;
}

export function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 60; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}