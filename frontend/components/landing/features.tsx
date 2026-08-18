"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  FileText,
  Lightbulb,
  Sparkles,
  SquareKanban,
  UsersRound,
} from "lucide-react";

import { Reveal, SectionHeading } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    id: "script",
    title: "AI Script Generator",
    description:
      "Turn a raw idea into a scroll-stopping script with a hook, story, and CTA in seconds.",
    icon: FileText,
    className: "lg:col-span-7 lg:row-span-2 lg:min-h-[520px]",
  },
  {
    id: "calendar",
    title: "Smart Calendar",
    description:
      "See every channel, deadline, and launch in one calm publishing rhythm.",
    icon: CalendarDays,
    className: "lg:col-span-5",
  },
  {
    id: "kanban",
    title: "Kanban Board",
    description:
      "Move content from idea to published without losing the creative thread.",
    icon: SquareKanban,
    className: "lg:col-span-5",
  },
  {
    id: "ideas",
    title: "Idea Generator",
    description:
      "Generate on-brand concepts based on your niche, audience, and voice.",
    icon: Lightbulb,
    className: "lg:col-span-5",
  },
  {
    id: "analytics",
    title: "Creator Analytics",
    description:
      "Understand what resonates and turn every result into your next winning idea.",
    icon: BarChart3,
    className: "lg:col-span-7",
  },
  {
    id: "collaboration",
    title: "Built for collaboration",
    description:
      "Invite editors, strategists, and partners into one shared creative workspace.",
    icon: UsersRound,
    className: "lg:col-span-12",
  },
] as const;

export function Features() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="relative scroll-mt-28 overflow-hidden bg-white py-24 sm:py-32 dark:bg-slate-950"
    >
      <div className="absolute left-1/2 top-1/3 size-[620px] -translate-x-1/2 rounded-full bg-[#C084FC]/10 blur-[130px] dark:bg-[#635BFF]/10" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Everything in flow"
          title="One workspace. Every creative move."
          description="CreatorHub connects the scattered pieces of your content business into one beautifully simple system."
        />

        <div className="grid auto-rows-[minmax(230px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.id}
              delay={Math.min(index * 0.05, 0.25)}
              className={cn("min-w-0", feature.className)}
            >
              <motion.article
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-slate-50/75 p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.28)] transition-[border-color,box-shadow] duration-300 hover:border-[#635BFF]/20 hover:shadow-[0_32px_80px_-42px_rgba(99,91,255,0.3)] sm:p-7 dark:border-white/10 dark:bg-white/[0.035]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-[#635BFF]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-white/5" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-2">
                    <span className="flex size-10 items-center justify-center rounded-2xl border border-[#635BFF]/10 bg-[#635BFF]/10 text-[#635BFF] shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-[#635BFF]/20 dark:text-violet-300">
                      <feature.icon className="size-5" />
                    </span>
                    <h3 className="pt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                    Live
                  </span>
                </div>
                <div className="relative mt-auto min-h-0 flex-1 pt-6">
                  <FeatureVisual id={feature.id} />
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({ id }: { id: (typeof FEATURES)[number]["id"] }) {
  if (id === "script") return <ScriptVisual />;
  if (id === "calendar") return <CalendarVisual />;
  if (id === "kanban") return <KanbanVisual />;
  if (id === "ideas") return <IdeasVisual />;
  if (id === "analytics") return <AnalyticsVisual />;
  return <CollaborationVisual />;
}

function ScriptVisual() {
  return (
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-xl shadow-slate-950/5 sm:p-4 dark:border-white/10 dark:bg-slate-900/75">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <Sparkles className="size-3.5 text-[#635BFF]" /> CreatorHub AI
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
          Draft ready
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-white/5">
          {[
            ["Idea", "5 habits creators need"],
            ["Tone", "Confident"],
            ["Duration", "60 seconds"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200/70 bg-white p-2 dark:border-white/10 dark:bg-slate-950/60">
              <p className="text-[8px] font-semibold tracking-wider text-slate-400 uppercase">
                {label}
              </p>
              <p className="mt-1 truncate text-[10px] font-medium text-slate-700 dark:text-slate-300">
                {value}
              </p>
            </div>
          ))}
          <div className="rounded-lg bg-[#635BFF] py-2 text-center text-[9px] font-semibold text-white">
            Generate script
          </div>
        </div>
        <div className="space-y-2">
          {[
            ["🔥 Hook", "orange", "You don't need more ideas. You need a system."],
            ["📝 Main content", "violet", "The most consistent creators remove friction before motivation disappears..."],
            ["📣 CTA", "emerald", "Save this and build your system today."],
          ].map(([label, color, text]) => (
            <div key={label} className="rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-white/5">
              <p className={cn("text-[9px] font-bold", color === "orange" ? "text-orange-500" : color === "emerald" ? "text-emerald-500" : "text-[#635BFF]")}>{label}</p>
              <p className="mt-1.5 text-[10px] leading-4 text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarVisual() {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-900/75">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">August 2026</p>
        <span className="text-[9px] text-slate-400">12 scheduled</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, index) => (
          <span
            key={index}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md text-[8px] text-slate-400",
              [4, 8, 11, 17].includes(index) && "bg-[#635BFF] font-semibold text-white shadow-sm",
              index === 14 && "bg-pink-500 font-semibold text-white",
            )}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function KanbanVisual() {
  const columns = [
    ["Idea", "3"],
    ["Draft", "2"],
    ["Ready", "4"],
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {columns.map(([label, count], column) => (
        <div key={label} className="rounded-xl bg-white/80 p-2 ring-1 ring-slate-200/70 dark:bg-slate-900/70 dark:ring-white/10">
          <div className="flex items-center justify-between text-[8px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{label}</span><span>{count}</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {Array.from({ length: column + 1 }, (_, item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-2 dark:bg-white/5">
                <span className="block h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IdeasVisual() {
  return (
    <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-[#635BFF]/15 via-[#C084FC]/15 to-[#EC4899]/10 dark:border-white/10">
      {["Trend-led", "On brand", "High intent"].map((tag, index) => (
        <motion.span
          key={tag}
          animate={{ y: [0, index % 2 ? 5 : -5, 0] }}
          transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "absolute rounded-full border border-white/80 bg-white/75 px-3 py-1.5 text-[10px] font-semibold text-slate-600 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-300",
            index === 0 && "left-5 top-5",
            index === 1 && "right-6 top-8",
            index === 2 && "bottom-4 left-1/3",
          )}
        >
          {tag}
        </motion.span>
      ))}
      <Lightbulb className="size-7 text-[#635BFF]" />
    </div>
  );
}

function AnalyticsVisual() {
  const heights = [28, 42, 35, 58, 47, 72, 62, 88, 76, 100];
  return (
    <div className="grid items-end gap-4 rounded-2xl border border-slate-200/70 bg-white/85 p-4 sm:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-slate-900/75">
      <div className="flex h-24 items-end gap-2">
        {heights.map((height, index) => (
          <motion.span
            key={index}
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            className="flex-1 rounded-t bg-gradient-to-t from-[#635BFF] to-[#C084FC] opacity-80"
          />
        ))}
      </div>
      <div className="min-w-24 rounded-xl bg-emerald-500/10 p-3">
        <p className="text-[9px] text-emerald-600 dark:text-emerald-400">Total reach</p>
        <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">128K</p>
        <p className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400">↑ 34.8%</p>
      </div>
    </div>
  );
}

function CollaborationVisual() {
  return (
    <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200/70 bg-white/80 p-4 sm:flex-row sm:items-center dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex -space-x-2">
        {["from-violet-400 to-indigo-500", "from-pink-400 to-rose-500", "from-sky-400 to-cyan-500", "from-amber-400 to-orange-500"].map((gradient) => (
          <span key={gradient} className={`size-10 rounded-full border-2 border-white bg-gradient-to-br ${gradient} dark:border-slate-900`} />
        ))}
        <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-500 dark:border-slate-900 dark:bg-slate-800 dark:text-slate-300">+8</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Comment", "Approve", "Publish"].map((action) => (
          <span key={action} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{action}</span>
        ))}
      </div>
    </div>
  );
}
