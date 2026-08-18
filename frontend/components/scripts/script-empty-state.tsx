import { FileText, PenLine, Sparkles, WandSparkles } from "lucide-react";

export function ScriptEmptyState() {
  return (
    <div className="relative flex min-h-[540px] min-w-0 w-full max-w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-card px-6 py-12 text-center shadow-[0_18px_60px_-42px_rgba(99,91,255,0.55)] lg:min-h-[650px] dark:bg-card/90">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(99,91,255,0.12),transparent_38%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(99,91,255,0.2),transparent_40%)]"
      />
      <div
        aria-hidden="true"
        className="relative mb-8 h-48 w-64 max-w-full"
      >
        <div className="absolute left-1/2 top-3 flex size-16 -translate-x-1/2 items-center justify-center rounded-2xl bg-gradient-to-br from-[#635BFF] to-violet-400 text-white shadow-xl shadow-[#635BFF]/25 transition-transform duration-300 hover:rotate-3 hover:scale-105">
          <WandSparkles className="size-7" />
        </div>
        <div className="absolute bottom-1 left-3 h-24 w-44 -rotate-6 rounded-2xl border border-violet-200/80 bg-white/70 p-4 shadow-lg backdrop-blur dark:border-violet-400/15 dark:bg-slate-900/70">
          <div className="mb-3 flex items-center gap-2">
            <PenLine className="size-3.5 text-[#635BFF]" />
            <span className="h-2 w-16 rounded-full bg-[#635BFF]/20" />
          </div>
          <div className="space-y-2">
            <span className="block h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="block h-1.5 w-4/5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="block h-1.5 w-3/5 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="absolute bottom-0 right-2 h-28 w-44 rotate-6 rounded-2xl border border-violet-200/80 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-violet-400/15 dark:bg-slate-900/90">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="size-3.5 text-violet-500" />
            <span className="h-2 w-20 rounded-full bg-violet-400/20" />
          </div>
          <div className="space-y-2">
            <span className="block h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="block h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="block h-1.5 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <Sparkles className="absolute right-6 top-7 size-5 animate-pulse text-fuchsia-400" />
        <Sparkles className="absolute left-7 top-16 size-4 animate-pulse text-violet-400 [animation-delay:400ms]" />
      </div>

      <div className="relative max-w-lg space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#635BFF]/15 bg-[#635BFF]/8 px-3 py-1 text-xs font-medium text-[#635BFF] dark:bg-[#635BFF]/15 dark:text-violet-300">
          <Sparkles className="size-3.5" />
          Your AI writing partner
        </span>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Generate your next viral script.
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pick your creative direction and CreatorHub will turn it into a
          ready-to-record story in seconds.
        </p>
      </div>

      <div className="relative mt-7 flex flex-wrap justify-center gap-2">
        {[
          "Scroll-stopping hook",
          "Structured narrative",
          "Clear call to action",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-border/70 bg-background/75 px-3 py-1.5 text-xs text-muted-foreground shadow-xs dark:bg-background/30"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
