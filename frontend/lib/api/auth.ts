import { NextRequest } from "next/server";
import { db, tokens } from "./db";
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
    const claims = JSON.parse(atob(b64));
    const user = claims.sub ? db.users.find((u) => u.supabase_id === claims.sub) : null;
    if (!user) return null;
    tokens.set(token, user.id);
    return user.id;
  } catch {
    return null;
  }
}

export function getUser(userId: number) {
  return db.users.find((u) => u.id === userId) ?? null;
}

export function getUserBySupabaseId(supabaseId: string) {
  return db.users.find((u) => u.supabase_id === supabaseId) ?? null;
}