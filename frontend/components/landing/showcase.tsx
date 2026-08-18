"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Sparkles,
  SquareKanban,
} from "lucide-react";

import { Floating, Reveal, SectionHeading } from "@/components/landing/motion";

export function Showcase() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="showcase" className="relative scroll-mt-24 overflow-hidden bg-[#F8FAFC] py-24 sm:py-32 dark:bg-slate-950">
      <div className="absolute left-0 top-20 size-[480px] rounded-full bg-[#635BFF]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 size-[440px] rounded-full bg-[#EC4899]/8 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="A calmer command center"
          title="Your entire creator business, at a glance."
          description="From the first spark to the final publish, every part of your workflow stays connected and visible."
        />

        <Reveal className="relative mx-auto max-w-6xl">
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -6, rotateX: 0.5 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/55 p-2 shadow-[0_50px_140px_-45px_rgba(99,91,255,0.4)] backdrop-blur-2xl sm:p-3 dark:border-white/10 dark:bg-white/5"
          >
            <div className="overflow-hidden rounded-[23px] border border-slate-200/80 bg-white dark:border-white/10 dark:bg-slate-950">
              <div className="flex h-11 items-center border-b border-slate-200/70 px-4 dark:border-white/10">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-rose-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="mx-auto rounded-md bg-slate-100 px-12 py-1 text-[8px] text-slate-400 sm:px-20 dark:bg-white/5">
                  app.creatorhub.io
                </div>
              </div>

              <div className="grid min-h-[520px] md:grid-cols-[180px_1fr]">
                <aside className="hidden border-r border-slate-200/70 bg-slate-950 p-4 md:block dark:border-white/10">
                  <div className="mb-7 flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#635BFF]">
                      <Sparkles className="size-3.5" />
                    </span>
                    CreatorHub
                  </div>
                  <div className="space-y-1.5">
                    {[
                      [LayoutDashboard, "Overview", false],
                      [Lightbulb, "Ideas", false],
                      [FileText, "Scripts", true],
                      [SquareKanban, "Kanban", false],
                      [CalendarDays, "Calendar", false],
                    ].map(([Icon, label, active]) => {
                      const ItemIcon = Icon as typeof LayoutDashboard;
                      return (
                        <div key={label as string} className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] ${active ? "bg-[#635BFF] text-white" : "text-slate-400"}`}>
                          <ItemIcon className="size-3.5" /> {label as string}
                        </div>
                      );
                    })}
                  </div>
                </aside>

                <div className="min-w-0 bg-slate-50/80 p-3 sm:p-5 dark:bg-slate-900/50">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400">Workspace / Scripts</p>
                      <h3 className="text-sm font-semibold text-slate-950 sm:text-base dark:text-white">AI Script Generator</h3>
                    </div>
                    <span className="size-8 rounded-full bg-gradient-to-br from-[#C084FC] to-[#EC4899]" />
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[0.95fr_1.45fr]">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
                      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                        <Sparkles className="size-3.5 text-[#635BFF]" /> Script settings
                      </div>
                      {["How creators avoid burnout", "Confident & warm", "60 seconds"].map((value, index) => (
                        <div key={value} className="mb-2 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
                          <p className="text-[7px] font-semibold tracking-wider text-slate-400 uppercase">{["Idea", "Tone", "Duration"][index]}</p>
                          <p className="mt-1 truncate text-[9px] font-medium text-slate-600 dark:text-slate-300">{value}</p>
                        </div>
                      ))}
                      <div className="mt-3 rounded-lg bg-[#635BFF] py-2 text-center text-[9px] font-semibold text-white">Generate script</div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">Build content, not burnout</p>
                        <span className="rounded-full bg-[#635BFF]/10 px-2 py-1 text-[7px] font-semibold text-[#635BFF]">AI draft</span>
                      </div>
                      {[
                        ["🔥 Hook", "Most creators don't burn out from creating. They burn out from chaos."],
                        ["📝 Main content", "A clear system gives every idea a home, every draft a next step, and every launch a rhythm..."],
                        ["📣 CTA", "Build your content system before your next idea arrives."],
                      ].map(([label, text]) => (
                        <div key={label} className="rounded-xl border border-slate-200/70 p-2.5 dark:border-white/10">
                          <p className="text-[8px] font-bold text-[#635BFF]">{label}</p>
                          <p className="mt-1 text-[8px] leading-3.5 text-slate-500 dark:text-slate-400">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <MiniKanban />
                    <MiniCalendar />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <Floating className="absolute -left-3 top-24 hidden md:block lg:-left-14" duration={5} distance={10}>
            <div className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-emerald-500" />
                <div><p className="text-[9px] text-slate-400">Weekly reach</p><p className="text-xs font-semibold text-slate-900 dark:text-white">+34.8%</p></div>
              </div>
            </div>
          </Floating>
          <Floating className="absolute -right-3 bottom-20 hidden md:block lg:-right-12" duration={5.7} distance={12} delay={0.5}>
            <div className="rounded-2xl border border-white/80 bg-white/75 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/75">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-[#635BFF]" />
                <div><p className="text-[9px] text-slate-400">Next post</p><p className="text-xs font-semibold text-slate-900 dark:text-white">Today, 6:00 PM</p></div>
              </div>
            </div>
          </Floating>
        </Reveal>
      </div>
    </section>
  );
}

function MiniKanban() {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <p className="mb-2 text-[9px] font-semibold text-slate-600 dark:text-slate-300">Kanban pipeline</p>
      <div className="grid grid-cols-3 gap-1.5">
        {[2, 1, 2].map((count, column) => (
          <div key={column} className="space-y-1 rounded-lg bg-slate-50 p-1.5 dark:bg-white/5">
            <span className="block h-1 w-8 rounded bg-slate-300 dark:bg-slate-600" />
            {Array.from({ length: count }, (_, item) => <span key={item} className="block h-5 rounded bg-white shadow-xs dark:bg-slate-800" />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCalendar() {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3 dark:border-white/10 dark:bg-slate-950/70">
      <p className="mb-2 text-[9px] font-semibold text-slate-600 dark:text-slate-300">Content calendar</p>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 14 }, (_, index) => <span key={index} className={`flex aspect-square items-center justify-center rounded text-[6px] ${[3, 8, 11].includes(index) ? "bg-[#635BFF] text-white" : "bg-slate-50 text-slate-400 dark:bg-white/5"}`}>{index + 1}</span>)}
      </div>
    </div>
  );
}
