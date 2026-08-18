"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";

import { Reveal } from "@/components/landing/motion";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="community" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28 dark:bg-slate-950">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-slate-950 px-6 py-16 text-center shadow-[0_40px_120px_-45px_rgba(99,91,255,0.55)] sm:px-12 sm:py-24 dark:ring-1 dark:ring-white/10">
          <motion.div
            aria-hidden="true"
            className="absolute -left-24 -top-32 -z-10 size-[430px] rounded-full bg-[#635BFF]/45 blur-[100px]"
            animate={reduceMotion ? undefined : { x: [0, 50, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-40 -right-20 -z-10 size-[450px] rounded-full bg-[#EC4899]/35 blur-[110px]"
            animate={reduceMotion ? undefined : { x: [0, -45, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 -z-10 opacity-15 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />

          <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-medium text-violet-200 backdrop-blur-xl">
            <Sparkles className="size-3.5" /> Join the next generation of creators
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Ready to become the next creator?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Build your system, protect your creative energy, and publish with confidence.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-2xl bg-white px-6 text-slate-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-violet-50">
              <Link href="/register">Start free <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-white/15 bg-white/8 px-6 text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:text-white">
              <Link href="#showcase"><Play className="fill-current" /> View demo</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
