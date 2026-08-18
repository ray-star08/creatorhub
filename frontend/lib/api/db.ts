/* In-memory mock database for demo/pitch. Resets on cold start. */

let nextId = 1;
function autoId(): number { return nextId++; }

export interface DbUser {
  id: number;
  supabase_id: string | null;
  name: string;
  email: string;
  password: string;
  level: number;
  xp: number;
  next_level_xp: number;
  title: string;
  momentum: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface DbQuest {
  id: number;
  user_id: number;
  title: string;
  xp_reward: number;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCard {
  id: number;
  user_id: number;
  title: string;
  type: string;
  column: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: number;
  user_id: number;
  niche: string | null;
  platform: string | null;
  audience: string | null;
  style: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbIdea {
  id: number;
  user_id: number;
  title: string | null;
  description: string | null;
  engagement_score: number | null;
  content: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface DbScript {
  id: number;
  user_id: number;
  idea_id: number | null;
  title: string;
  hook: string;
  content: string;
  cta: string;
  created_at: string;
  updated_at: string;
}

export interface DbSchedule {
  id: number;
  user_id: number;
  title: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export const TITLES: Record<number, string> = {
  1: "Aspiring Creator",
  2: "Content Builder",
  3: "Growth Hacker",
  4: "Viral Strategist",
  5: "Algorithm Whisperer",
};

export const CARD_COLUMNS = ["ideas", "scripted", "filming", "editing", "posted"] as const;
export const MOVE_REWARDS: Record<string, number> = { posted: 50, editing: 20 };
export const DEFAULT_MOVE_REWARD = 5;

export const STATUS_TO_COLUMN: Record<string, string> = {
  idea: "ideas",
  draft: "scripted",
  editing: "editing",
  ready: "filming",
  published: "posted",
};

export const COLUMN_TO_STATUS: Record<string, string> = {
  ideas: "idea",
  scripted: "draft",
  editing: "editing",
  filming: "ready",
  posted: "published",
};

function now(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

export const db = {
  users: [] as DbUser[],
  quests: [] as DbQuest[],
  cards: [] as DbCard[],
  profiles: [] as DbProfile[],
  ideas: [] as DbIdea[],
  scripts: [] as DbScript[],
  schedules: [] as DbSchedule[],
  now,
  autoId,
};

export const tokens = new Map<string, number>(); // token -> user_id