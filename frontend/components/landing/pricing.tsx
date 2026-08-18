"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Reveal, SectionHeading } from "@/components/landing/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    description: "Dapatkan credit awal untuk mencoba semua fitur utama.",
    price: "Rp 0",
    suffix: "/ Selamanya",
    features: [
      "15 One-time AI Credits (Gratis di awal)",
      "1 Kanban Board (Maks. 10 Card)",
      "Content Calendar (Akses 7 Hari)",
    ],
    cta: "Start free",
    href: "/register",
    note: "Tanpa kartu kredit • Akses langsung",
    featured: false,
  },
  {
    name: "Creator Pro",
    description: "For creators ready to grow consistently.",
    price: "Rp 49.000",
    suffix: "/ Bulan",
    features: [
      "Unlimited AI ideas",
      "100 scripts per month",
      "Advanced creator analytics",
      "Multi-platform calendar",
      "Priority AI generation",
    ],
    cta: "Go Pro",
    href: "/register?plan=pro",
    featured: true,
  },
  {
    name: "Creator Enterprise",
    description: "A shared workspace for creative teams.",
    price: "Rp 159.000",
    suffix: "/ Bulan",
    features: [
      "Everything in Creator Pro",
      "Up to 10 collaborators",
      "Review and approval flows",
      "Shared brand profiles",
      "Priority support",
    ],
    cta: "Start with Enterprise",
    href: "/register?plan=enterprise",
    featured: false,
  },
] as const;

export function Pricing() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 overflow-hidden bg-white py-24 sm:py-32 dark:bg-slate-950"
    >
      <div className="absolute left-1/2 top-36 size-[600px] -translate-x-1/2 rounded-full bg-[#635BFF]/8 blur-[130px] dark:bg-[#635BFF]/10" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Simple pricing"
          title="Start free. Scale when you are ready."
          description="No complicated tiers or hidden limits. Choose the workspace that fits where your creator business is today."
        />

        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.08}>
              <motion.article
                whileHover={reduceMotion ? undefined : { y: -8 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative flex min-h-[490px] flex-col overflow-hidden rounded-[28px] border p-6 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)] transition-shadow duration-300 hover:shadow-[0_32px_90px_-42px_rgba(99,91,255,0.3)] sm:p-7",
                  plan.featured
                    ? "border-[#635BFF]/35 bg-slate-950 text-white ring-1 ring-[#635BFF]/20 dark:bg-white dark:text-slate-950"
                    : "border-slate-200/80 bg-slate-50/70 text-slate-950 dark:border-white/10 dark:bg-white/[0.035] dark:text-white",
                )}
              >
                {plan.featured ? (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(192,132,252,0.25),transparent_36%)] dark:bg-[radial-gradient(circle_at_80%_0%,rgba(99,91,255,0.14),transparent_36%)]" />
                    <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200 ring-1 ring-white/10 dark:bg-[#635BFF]/10 dark:text-[#635BFF] dark:ring-[#635BFF]/15">
                      <Sparkles className="size-3" /> Most popular
                    </span>
                  </>
                ) : null}

                <div className="relative">
                  <p className={cn("text-sm font-semibold", plan.featured ? "text-violet-200 dark:text-[#635BFF]" : "text-[#635BFF] dark:text-violet-300")}>{plan.name}</p>
                  <p className={cn("mt-2 max-w-[240px] text-sm leading-6", plan.featured ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400")}>{plan.description}</p>
                  <div className="mt-7 flex flex-wrap items-end gap-x-2 gap-y-1">
                    <span className="whitespace-nowrap text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-4xl">{plan.price}</span>
                    <span className={cn("whitespace-nowrap pb-1 text-xs", plan.featured ? "text-slate-400 dark:text-slate-500" : "text-slate-400")}>{plan.suffix}</span>
                  </div>
                </div>

                <div className="relative my-7 h-px bg-current opacity-10" />

                <ul className="relative space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className={cn("flex items-start gap-2.5 text-sm", plan.featured ? "text-slate-200 dark:text-slate-700" : "text-slate-600 dark:text-slate-300")}>
                      <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", plan.featured ? "bg-[#635BFF] text-white dark:bg-[#635BFF]/10 dark:text-[#635BFF]" : "bg-[#635BFF]/10 text-[#635BFF]")}>
                        <Check className="size-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={plan.featured ? "secondary" : "outline"}
                  className={cn(
                    "relative mt-auto h-11 w-full rounded-xl transition-all duration-300 hover:-translate-y-0.5",
                    plan.featured
                      ? "bg-white text-slate-950 hover:bg-violet-50 dark:bg-[#635BFF] dark:text-white dark:hover:bg-[#554DE8]"
                      : "border-slate-200 bg-white hover:border-[#635BFF]/30 hover:bg-[#635BFF]/5 dark:border-white/10 dark:bg-white/5",
                  )}
                >
                  <Link href={plan.href}>
                    {plan.cta}
                    <ArrowRight />
                  </Link>
                </Button>

                {"note" in plan && plan.note ? (
                  <p className="relative mt-3 text-center text-[11px] leading-4 text-slate-400 dark:text-slate-500">
                    {plan.note}
                  </p>
                ) : null}
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
