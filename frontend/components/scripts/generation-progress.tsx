"use client";

import { useEffect, useState } from "react";
import { Check, Circle, Loader2, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const STAGES = [
  "Analyzing idea...",
  "Creating hook...",
  "Writing content...",
  "Generating CTA...",
] as const;

const STAGE_DELAYS = [700, 1500, 2400];
const STAGE_PROGRESS = [18, 42, 70, 92];

export function GenerationProgress() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timers = STAGE_DELAYS.map((delay, index) =>
      window.setTimeout(() => setActiveStage(index + 1), delay),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div
      className="min-h-[540px] min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-[#635BFF]/20 bg-card shadow-[0_18px_60px_-36px_rgba(99,91,255,0.55)] lg:min-h-[650px] dark:bg-card/90"
      aria-live="polite"
      aria-label={`Generating script: ${STAGES[activeStage]}`}
    >
      <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-r from-[#635BFF]/10 via-violet-500/5 to-transparent p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-1/2 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/5" />
        <div className="relative flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center rounded-2xl bg-[#635BFF] text-white shadow-lg shadow-[#635BFF]/25">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-[#635BFF]/30" />
            <Sparkles className="relative size-5 animate-pulse" />
          </div>
          <div>
            <p className="font-semibold">CreatorHub AI is writing</p>
            <p className="text-sm text-muted-foreground">
              Building your script one beat at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[190px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Progress
            value={STAGE_PROGRESS[activeStage]}
            className="h-1.5 bg-[#635BFF]/10 [&_[data-slot=progress-indicator]]:bg-[#635BFF]"
          />
          <div className="space-y-1.5">
            {STAGES.map((stage, index) => {
              const complete = index < activeStage;
              const active = index === activeStage;

              return (
                <div
                  key={stage}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all duration-300",
                    active &&
                      "bg-[#635BFF]/8 font-medium text-[#635BFF] dark:bg-[#635BFF]/15 dark:text-violet-300",
                    !active && !complete && "text-muted-foreground/60",
                    complete && "text-muted-foreground",
                  )}
                >
                  {complete ? (
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                    </span>
                  ) : active ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Circle className="size-5" />
                  )}
                  {stage}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <LoadingSection className="border-orange-500/15">
            <Skeleton className="h-3 w-16 bg-orange-500/15" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </LoadingSection>
          <LoadingSection className="border-[#635BFF]/15">
            <Skeleton className="h-3 w-28 bg-[#635BFF]/15" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </LoadingSection>
          <LoadingSection className="border-emerald-500/15">
            <Skeleton className="h-3 w-24 bg-emerald-500/15" />
            <Skeleton className="h-4 w-2/3" />
          </LoadingSection>
        </div>
      </div>
    </div>
  );
}

function LoadingSection({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "gap-3 rounded-2xl border bg-background/65 py-4 shadow-sm",
        className,
      )}
    >
      <CardHeader className="px-4">{children}</CardHeader>
      <CardContent className="hidden" />
    </Card>
  );
}
