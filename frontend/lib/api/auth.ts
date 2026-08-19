import { NextRequest } from "next/server";
import { db, tokens, type DbUser } from "./db";
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

  // ponytail: token is a Supabase JWT — decode `sub` and re-bind by supabase_id
  // (in-memory map may be lost on recompile). Replace with real DB session lookup.
  try {
    const payload = token.split(".")[1];
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const json = new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
    const claims = JSON.parse(json);
    if (!claims.sub) return null;
    let user = db.users.find((u) => u.supabase_id === claims.sub) ?? null;
    if (!user) {
      // valid Supabase token but user missing from in-memory db (state wipe):
      // upsert on the fly instead of 401
      user = upsertUserFromClaims(claims.sub, claims.email, claims.user_metadata?.name);
    }
    tokens.set(token, user.id);
    return user.id;
  } catch {
    return null;
  }
}

function upsertUserFromClaims(supabaseId: string, email: string | undefined, name: string | undefined): DbUser {
  const now = db.now();
  const user: DbUser = {
    id: db.autoId(),
    supabase_id: supabaseId,
    name: name ?? (email ? email.split("@")[0] : "Creator"),
    email: email ?? `${supabaseId}@unknown.local`,
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