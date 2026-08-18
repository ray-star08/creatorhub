/** Kanban task lifecycle — mirrors the backend `tasks.status` enum. */
export type TaskStatus = "idea" | "draft" | "editing" | "ready" | "published";

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: number;
  user_id: number;
  niche: string;
  platform: string;
  audience: string;
  style: string;
  created_at?: string;
  updated_at?: string;
}

export interface Idea {
  id: number;
  user_id: number;
  title: string;
  description: string;
  engagement_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface Script {
  id: number;
  user_id: number;
  idea_id: number | null;
  title: string;
  hook: string;
  content: string;
  cta: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  status: TaskStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  id: number;
  user_id: number;
  title: string;
  publish_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
