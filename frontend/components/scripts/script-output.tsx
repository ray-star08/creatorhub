"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Flame,
  Megaphone,
  PenLine,
  RefreshCw,
  Sparkles,
  SquareKanban,
} from "lucide-react";

import type { Script } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScriptOutputProps {
  script: Script;
  disabled: boolean;
  savingToKanban: boolean;
  savedToKanban: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  onSaveToKanban: () => void;
  onTypingComplete: () => void;
}

export function ScriptOutput({
  script,
  disabled,
  savingToKanban,
  savedToKanban,
  onCopy,
  onRegenerate,
  onExport,
  onSaveToKanban,
  onTypingComplete,
}: ScriptOutputProps) {
  const typed = useTypedScript(script, onTypingComplete);
  const wordCount = useMemo(
    () =>
      [script.hook, script.content, script.cta]
        .join(" ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    [script],
  );

  return (
    <article className="min-h-[540px] min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_60px_-42px_rgba(99,91,255,0.6)] lg:min-h-[650px] dark:bg-card/90">
      <header className="min-w-0 max-w-full overflow-hidden border-b border-border/60 bg-gradient-to-r from-[#635BFF]/8 via-transparent to-fuchsia-500/5 p-5 sm:p-6">
        <div className="flex min-w-0 max-w-full flex-col gap-4 overflow-hidden">
          <div className="flex min-w-0 max-w-full flex-col gap-3 overflow-hidden sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2 overflow-hidden">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-[#635BFF]/15 bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-violet-300">
                  <Sparkles />
                  AI-generated draft
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {wordCount} words
                </span>
              </div>
              <h2
                className="max-w-full truncate text-xl font-semibold tracking-tight sm:text-2xl"
                title={script.title}
              >
                {script.title}
              </h2>
            </div>

            {disabled ? (
              <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#635BFF]/8 px-3 py-1.5 text-xs font-medium text-[#635BFF] dark:bg-[#635BFF]/15 dark:text-violet-300">
                <span className="size-1.5 animate-pulse rounded-full bg-[#635BFF]" />
                AI is typing…
              </span>
            ) : null}
          </div>

          <div className="flex min-w-0 max-w-full flex-wrap gap-2 overflow-hidden">
            <ActionButton icon={Copy} label="Copy script" onClick={onCopy} disabled={disabled} />
            <ActionButton icon={RefreshCw} label="Regenerate" onClick={onRegenerate} disabled={disabled} />
            <ActionButton icon={Download} label="Export markdown" onClick={onExport} disabled={disabled} />
            <ActionButton
              icon={savedToKanban ? Check : SquareKanban}
              label={
                savingToKanban
                  ? "Saving…"
                  : savedToKanban
                    ? "Saved to Kanban"
                    : "Save to Kanban"
              }
              onClick={onSaveToKanban}
              disabled={disabled || savingToKanban || savedToKanban}
              primary={!savedToKanban}
            />
          </div>
        </div>
      </header>

      <div className="min-w-0 max-w-full space-y-4 overflow-hidden p-4 sm:p-6">
        <ScriptSectionCard
          icon={Flame}
          label="🔥 Hook"
          description="Open strong and earn the next few seconds."
          text={typed.hook}
          fullText={script.hook}
          typing={typed.activeSection === "hook"}
          waiting={typed.activeSection === "hook" && !typed.hook}
          className="border-orange-500/15 hover:border-orange-500/30"
          iconClassName="bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
        <ScriptSectionCard
          icon={PenLine}
          label="📝 Main Content"
          description="The core narrative, structured and ready to record."
          text={typed.content}
          fullText={script.content}
          typing={typed.activeSection === "content"}
          waiting={!typed.content && typed.activeSection !== "done"}
          className="border-[#635BFF]/15 hover:border-[#635BFF]/30"
          iconClassName="bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-violet-300"
        />
        <ScriptSectionCard
          icon={Megaphone}
          label="📣 Call To Action"
          description="End with one clear action for your audience."
          text={typed.cta}
          fullText={script.cta}
          typing={typed.activeSection === "cta"}
          waiting={!typed.cta && typed.activeSection !== "done"}
          className="border-emerald-500/15 hover:border-emerald-500/30"
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </article>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  primary,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={primary ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-w-0 max-w-full overflow-hidden rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]",
        primary &&
          "bg-[#635BFF] text-white hover:bg-[#5750e6] dark:bg-[#635BFF] dark:text-white",
      )}
    >
      <Icon className="shrink-0" />
      <span className="min-w-0 truncate">{label}</span>
    </Button>
  );
}

function ScriptSectionCard({
  icon: Icon,
  label,
  description,
  text,
  fullText,
  typing,
  waiting,
  className,
  iconClassName,
}: {
  icon: typeof Flame;
  label: string;
  description: string;
  text: string;
  fullText: string;
  typing: boolean;
  waiting: boolean;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <section
      className={cn(
        "group min-w-0 w-full max-w-full overflow-hidden rounded-2xl border bg-background/65 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 dark:bg-background/25",
        className,
      )}
    >
      <div className="mb-4 flex min-w-0 max-w-full items-start gap-3 overflow-hidden">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            iconClassName,
          )}
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <h3 className="truncate text-sm font-semibold">{label}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <p className="sr-only">{fullText}</p>
      <div
        aria-hidden="true"
        className={cn(
          "min-h-6 min-w-0 max-w-full break-words text-sm leading-7 whitespace-pre-wrap [overflow-wrap:anywhere] sm:text-[15px]",
          waiting && "text-muted-foreground",
        )}
      >
        {text}
        {typing ? (
          <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse rounded-full bg-[#635BFF]" />
        ) : null}
        {waiting ? (
          <span className="inline-flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1 animate-pulse rounded-full bg-current"
                style={{ animationDelay: `${dot * 180}ms` }}
              />
            ))}
          </span>
        ) : null}
      </div>
    </section>
  );
}

type ActiveSection = "hook" | "content" | "cta" | "done";

function useTypedScript(script: Script, onComplete: () => void) {
  const total = script.hook.length + script.content.length + script.cta.length;
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const callbackRef = useRef(onComplete);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (total === 0) {
      callbackRef.current();
      return;
    }

    const charactersPerTick = Math.max(1, Math.ceil(total / 170));
    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => {
        const next = Math.min(total, current + charactersPerTick);
        if (next === total) {
          window.clearInterval(timer);
          window.setTimeout(() => callbackRef.current(), 180);
        }
        return next;
      });
    }, 16);

    return () => window.clearInterval(timer);
  }, [script.id, script.hook, script.content, script.cta, total]);

  const hookEnd = script.hook.length;
  const contentEnd = hookEnd + script.content.length;
  const hook = script.hook.slice(0, Math.min(visibleCharacters, hookEnd));
  const content = script.content.slice(
    0,
    Math.max(0, Math.min(script.content.length, visibleCharacters - hookEnd)),
  );
  const cta = script.cta.slice(
    0,
    Math.max(0, Math.min(script.cta.length, visibleCharacters - contentEnd)),
  );

  let activeSection: ActiveSection = "done";
  if (visibleCharacters < hookEnd) activeSection = "hook";
  else if (visibleCharacters < contentEnd) activeSection = "content";
  else if (visibleCharacters < total) activeSection = "cta";

  return { hook, content, cta, activeSection };
}
