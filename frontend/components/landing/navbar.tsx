"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";

const NAVIGATION = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#community" },
] as const;

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <nav className="relative mx-auto max-w-7xl rounded-2xl border border-white/70 bg-white/72 px-3 shadow-[0_12px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="CreatorHub home"
            className="rounded-xl focus-visible:ring-2 focus-visible:ring-[#635BFF] focus-visible:outline-none"
          >
            <Logo
              markClassName="size-9 rounded-xl bg-gradient-to-br from-[#635BFF] to-[#C084FC] text-white shadow-lg shadow-violet-500/20"
              className="text-slate-950 dark:text-white"
            />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAVIGATION.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-300 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <ModeToggle />
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-xl text-slate-700 sm:inline-flex dark:text-slate-200"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="hidden h-9 rounded-xl bg-[#635BFF] px-4 text-white shadow-lg shadow-[#635BFF]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#554DE8] hover:shadow-xl sm:inline-flex"
            >
              <Link href="/dashboard">
                Dashboard
                <ArrowUpRight />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl md:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
            >
              <div className="grid gap-1 border-t border-slate-200/70 py-3 dark:border-white/10">
                {NAVIGATION.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/8"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-xl bg-[#635BFF] text-white hover:bg-[#554DE8]"
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
