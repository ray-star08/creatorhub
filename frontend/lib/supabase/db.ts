import { createClient } from "./server";

export interface SupabaseIdea {
  id: number;
  user_id: string;
  title: string | null;
  description: string | null;
  topic: string | null;
  engagement_score: number | null;
  created_at: string;
}

export interface SupabaseScript {
  id: number;
  idea_id: number | null;
  user_id: string;
  hook: string | null;
  main_content: string | null;
  cta: string | null;
  created_at: string;
}

function supabase() {
  return createClient().then((c) => c);
}

// ---- Ideas ----

export async function getIdeas(userId: string): Promise<SupabaseIdea[]> {
  const client = await supabase();
  const { data, error } = await client
    .from("ideas")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch ideas: ${error.message}`);
  return (data as SupabaseIdea[]) ?? [];
}

export async function getIdea(id: number, userId: string): Promise<SupabaseIdea | null> {
  const client = await supabase();
  const { data, error } = await client
    .from("ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch idea: ${error.message}`);
  }
  return data as SupabaseIdea;
}

export async function createIdea(idea: {
  user_id: string;
  title: string;
  description: string | null;
  topic: string | null;
  engagement_score: number | null;
}): Promise<SupabaseIdea | null> {
  const client = await supabase();
  const { data, error } = await client
    .from("ideas")
    .insert({
      user_id: idea.user_id,
      title: idea.title,
      description: idea.description,
      topic: idea.topic,
      engagement_score: idea.engagement_score,
    })
    .select()
    .single();

  if (error) {
    console.error("createIdea error:", error.message);
    return null;
  }
  return data as SupabaseIdea;
}

export async function deleteIdea(id: number, userId: string): Promise<boolean> {
  const client = await supabase();
  const { error, count } = await client
    .from("ideas")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete idea: ${error.message}`);
  return (count ?? 0) > 0;
}

// ---- Scripts ----

export async function getScripts(userId: string): Promise<SupabaseScript[]> {
  const client = await supabase();
  const { data, error } = await client
    .from("scripts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch scripts: ${error.message}`);
  return (data as SupabaseScript[]) ?? [];
}

export async function createScript(script: {
  user_id: string;
  idea_id: number | null;
  hook: string;
  main_content: string;
  cta: string;
}): Promise<SupabaseScript> {
  const client = await supabase();
  const { data, error } = await client
    .from("scripts")
    .insert({
      user_id: script.user_id,
      idea_id: script.idea_id,
      hook: script.hook,
      main_content: script.main_content,
      cta: script.cta,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create script: ${error.message}`);
  return data as SupabaseScript;
}

export async function deleteScript(id: number, userId: string): Promise<boolean> {
  const client = await supabase();
  const { error, count } = await client
    .from("scripts")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete script: ${error.message}`);
  return (count ?? 0) > 0;
}