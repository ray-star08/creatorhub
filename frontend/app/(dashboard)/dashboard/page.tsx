"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  Lightbulb,
  PenLine,
  Sparkles,
  SquareKanban,
} from "lucide-react";

import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { getGreeting, unwrapList } from "@/lib/format";
import type { Script, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

const QUICK_ACTIONS = [
  {
    title: "Generate ideas",
    description: "Brainstorm on-brand content ideas with AI.",
    href: "/ideas/generate",
    icon: Lightbulb,
  },
  {
    title: "Write a script",
    description: "Turn any idea into a ready-to-record script.",
    href: "/scripts/generate",
    icon: FileText,
  },
  {
    title: "Plan on Kanban",
    description: "Move content from idea to published.",
    href: "/kanban",
    icon: SquareKanban,
  },
  {
    title: "Schedule posts",
    description: "See your publishing calendar at a glance.",
    href: "/calendar",
    icon: CalendarDays,
  },
] as const;

interface Stats {
  scripts: number;
  drafts: number;
  published: number;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  // The greeting depends on the local clock, so it must be computed on the
  // client only — a lazy useState initializer still runs during SSR and would
  // mismatch the server's timezone. Start neutral, fill in after mount.
  const [greeting, setGreeting] = useState("Welcome");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    scripts: 0,
    drafts: 0,
    published: 0,
  });

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [scriptsRes, tasksRes] = await Promise.all([
          api.get<Script[] | { data: Script[] }>("/scripts"),
          api.get<Task[] | { data: Task[] }>("/tasks"),
        ]);
        if (!active) return;

        const scripts = unwrapList(scriptsRes.data);
        const tasks = unwrapList(tasksRes.data);

        setStats({
          scripts: scripts.length,
          drafts: tasks.filter(
            (task) => task.status === "draft" || task.status === "editing",
          ).length,
          published: tasks.filter((task) => task.status === "published").length,
        });
      } catch {
        // Backend may be offline in local dev — keep zeros, no crash.
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const firstName = user?.name?.split(" ")[0] ?? "Creator";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <Card className="bg-primary text-primary-foreground relative overflow-hidden border-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(50%_80%_at_85%_10%,white,transparent)]"
        />
        <CardContent className="relative p-6 sm:p-8">
          <p className="text-primary-foreground/80 text-sm">{greeting},</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {firstName} 👋
          </h2>
          <p className="text-primary-foreground/80 mt-2 max-w-md text-sm">
            Ready to create something today? Start with a fresh idea or jump
            back into your board.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/ideas/generate">
                <Sparkles />
                Generate ideas
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
            >
              <Link href="/kanban">
                Open board
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total scripts"
          value={stats.scripts}
          icon={FileText}
          loading={loading}
        />
        <StatCard
          label="In draft"
          value={stats.drafts}
          icon={PenLine}
          loading={loading}
          accentClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Published"
          value={stats.published}
          icon={CheckCircle2}
          loading={loading}
          accentClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </section>

      {/* Quick actions */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">Quick actions</h3>
          <p className="text-muted-foreground text-sm">
            Jump straight into your workflow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ title, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group">
              <Card className="hover:border-primary/40 h-full transition-colors">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-1.5 text-base">
                      {title}
                      <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
