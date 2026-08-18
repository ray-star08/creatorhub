"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  FileText,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Floating, Reveal } from "@/components/landing/motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-24 lg:min-h-[820px] lg:pb-36 lg:pt-28">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[#F8FAFC] dark:bg-slate-950" />
      <motion.div
        aria-hidden="true"
        className="absolute -left-32 -top-40 -z-10 size-[520px] rounded-full bg-[#635BFF]/25 blur-[110px] dark:bg-[#635BFF]/20"
        animate={
          reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute -right-40 top-12 -z-10 size-[560px] rounded-full bg-[#C084FC]/25 blur-[120px] dark:bg-[#C084FC]/15"
        animate={
          reduceMotion ? undefined : { x: [0, -50, 0], y: [0, 70, 0], scale: [1, 0.9, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-45 [background-image:linear-gradient(to_right,rgba(99,91,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,91,255,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)] dark:opacity-20"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="max-w-2xl">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#635BFF]/20 bg-white/65 px-3 py-1.5 text-xs font-semibold text-[#635BFF] shadow-sm backdrop-blur-xl dark:bg-white/5 dark:text-violet-300">
              <Sparkles className="size-3.5" />
              The operating system for creators
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 text-[clamp(3.5rem,7vw,6.6rem)] leading-[0.9] font-semibold tracking-[-0.07em] text-slate-950 dark:text-white">
              Build Content.
              <span className="mt-2 block bg-gradient-to-r from-[#635BFF] via-[#9B70F8] to-[#EC4899] bg-clip-text text-transparent">
                Not Burnout.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
              Plan, script, and manage your content empire from one dashboard.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-2xl bg-[#635BFF] px-6 text-base text-white shadow-xl shadow-[#635BFF]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#554DE8] hover:shadow-2xl"
              >
                <Link href="/register">
                  Get started free
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-white/80 bg-white/55 px-6 text-base text-slate-800 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Link href="#showcase">
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Play className="size-3 fill-current" />
                  </span>
                  Watch demo
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              {[
                "No credit card",
                "Set up in 60 seconds",
                "Cancel anytime",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.18} className="relative min-w-0">
          <div className="relative mx-auto h-[520px] w-full max-w-[650px] sm:h-[600px]">
            <div className="absolute inset-x-5 top-16 overflow-hidden rounded-[28px] border border-white/80 bg-white/58 p-3 shadow-[0_40px_120px_-35px_rgba(99,91,255,0.45)] backdrop-blur-2xl sm:inset-x-10 sm:p-4 dark:border-white/10 dark:bg-slate-900/60">
              <div className="rounded-[22px] border border-slate-200/80 bg-white/85 p-4 dark:border-white/10 dark:bg-slate-950/75">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-400" />
                    <span className="size-2.5 rounded-full bg-amber-400" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500 dark:bg-white/8 dark:text-slate-400">
                    creatorhub.app
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-[48px_1fr] gap-4 sm:grid-cols-[72px_1fr]">
                  <div className="space-y-3 rounded-2xl bg-slate-950 p-2 sm:p-3">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#635BFF] text-white">
                      <Sparkles className="size-3.5" />
                    </span>
                    {[0, 1, 2, 3].map((item) => (
                      <span
                        key={item}
                        className="block h-7 rounded-lg bg-white/8 sm:h-8"
                      />
                    ))}
                  </div>
                  <div className="min-w-0 space-y-4 py-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Good morning,</p>
                        <p className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                          Ready to create?
                        </p>
                      </div>
                      <span className="size-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["24 ideas", "12 drafts", "8 live"].map((stat) => (
                        <div
                          key={stat}
                          className="rounded-xl border border-slate-200/70 bg-slate-50 p-2 text-[9px] font-medium text-slate-600 sm:p-3 sm:text-[11px] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                          {stat}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#8B7CFF] p-4 text-white shadow-lg shadow-violet-500/15">
                      <div className="flex items-center gap-2 text-[10px] font-medium text-white/75">
                        <WandSparkles className="size-3" /> AI workspace
                      </div>
                      <p className="mt-2 text-sm font-semibold sm:text-base">
                        Turn your next idea into a script.
                      </p>
                      <div className="mt-4 h-2 rounded-full bg-white/15">
                        <div className="h-full w-2/3 rounded-full bg-white/80" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-20 rounded-xl border border-slate-200/70 bg-slate-50 dark:border-white/10 dark:bg-white/5" />
                      <div className="h-20 rounded-xl border border-slate-200/70 bg-slate-50 dark:border-white/10 dark:bg-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Floating className="absolute right-0 top-3 sm:right-1" duration={4.8} distance={12}>
              <HeroCard icon={FileText} label="AI Script Generator" value="Draft ready" accent="violet" />
            </Floating>
            <Floating className="absolute bottom-11 left-0 sm:left-1" duration={5.4} distance={10} delay={0.4}>
              <HeroCard icon={BarChart3} label="Analytics" value="+34.8% reach" accent="pink" />
            </Floating>
            <Floating className="absolute bottom-0 right-3 sm:right-8" duration={5.8} distance={14} delay={0.8}>
              <HeroCard icon={CalendarDays} label="Calendar" value="4 posts ready" accent="blue" />
            </Floating>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  accent: "violet" | "pink" | "blue";
}) {
  const colors = {
    violet: "bg-[#635BFF]/12 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-violet-300",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  };

  return (
    <div className="flex min-w-[170px] items-center gap-3 rounded-2xl border border-white/80 bg-white/75 p-3 shadow-[0_18px_50px_-22px_rgba(15,23,42,0.35)] backdrop-blur-2xl transition-transform duration-300 hover:scale-105 sm:min-w-[190px] sm:p-4 dark:border-white/10 dark:bg-slate-900/75">
      <span className={`flex size-9 items-center justify-center rounded-xl ${colors[accent]}`}>
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-[10px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
          {label}
        </p>
        <p className="text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
