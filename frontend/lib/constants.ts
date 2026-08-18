import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  Lightbulb,
  SquareKanban,
  type LucideIcon,
} from "lucide-react";
import type { TaskStatus } from "@/lib/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

/** Primary navigation shown in the sidebar and mobile sheet. */
export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Idea Generator", href: "/ideas/generate", icon: Lightbulb },
  { title: "Script Generator", href: "/scripts/generate", icon: FileText },
  { title: "Kanban", href: "/kanban", icon: SquareKanban },
  { title: "Calendar", href: "/calendar", icon: CalendarDays },
];

export interface KanbanColumnDef {
  id: TaskStatus;
  title: string;
  /** Tailwind classes for the status accent dot. */
  accent: string;
}

/** Ordered Kanban columns matching the backend status enum. */
export const KANBAN_COLUMNS: KanbanColumnDef[] = [
  { id: "idea", title: "Idea", accent: "bg-slate-400" },
  { id: "draft", title: "Draft", accent: "bg-amber-400" },
  { id: "editing", title: "Editing", accent: "bg-blue-400" },
  { id: "ready", title: "Ready", accent: "bg-violet-400" },
  { id: "published", title: "Published", accent: "bg-emerald-500" },
];

export const CONTENT_STYLES = [
  "Educational",
  "Entertaining",
  "Storytelling",
  "Inspirational",
  "Comedic",
  "Tutorial / How-to",
  "Vlog",
  "Review",
] as const;

export const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube",
  "YouTube Shorts",
  "X (Twitter)",
  "LinkedIn",
] as const;

export const SCRIPT_TONES = [
  "Casual",
  "Professional",
  "Energetic",
  "Humorous",
  "Inspirational",
  "Educational",
] as const;

export const SCRIPT_DURATIONS = [
  { label: "15 seconds", value: "15s" },
  { label: "30 seconds", value: "30s" },
  { label: "60 seconds", value: "60s" },
  { label: "3 minutes", value: "3m" },
  { label: "5–10 minutes", value: "long" },
] as const;
