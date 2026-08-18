"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, y, filter: "blur(10px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Floating({
  children,
  className,
  duration = 5,
  distance = 10,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -distance, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={cn(
        "mx-auto mb-12 max-w-2xl space-y-4 sm:mb-16",
        align === "center" ? "text-center" : "mx-0 text-left",
      )}
    >
      <span className="inline-flex rounded-full border border-[#635BFF]/15 bg-[#635BFF]/8 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-[#635BFF] uppercase dark:bg-[#635BFF]/15 dark:text-violet-300">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
        {description}
      </p>
    </Reveal>
  );
}
