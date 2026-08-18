"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock,
  FileText,
  Lightbulb,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { Idea } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DurationSelect } from "@/components/duration-select";
import { EmptyState } from "@/components/common/empty-state";
import { IdeaSelect } from "@/components/idea-select";
import { ToneSelect } from "@/components/tone-select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem } from "@/components/ui/form";

export interface ScriptSettingsValues {
  idea_id: string;
  tone: string;
  duration: string;
}

interface ScriptSettingsProps {
  form: UseFormReturn<ScriptSettingsValues>;
  ideas: Idea[];
  loadingIdeas: boolean;
  disabled: boolean;
  onSubmit: (values: ScriptSettingsValues) => void | Promise<void>;
  hasInitialIdea?: boolean;
}

export function ScriptSettings({
  form,
  ideas,
  loadingIdeas,
  disabled,
  onSubmit,
  hasInitialIdea = false,
}: ScriptSettingsProps) {
  const noIdeas = !loadingIdeas && ideas.length === 0 && !hasInitialIdea;

  return (
    <Card className="relative min-w-0 w-full max-w-full overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-[0_16px_50px_-32px_rgba(99,91,255,0.6)] backdrop-blur transition-all duration-300 xl:sticky xl:top-24 xl:w-[420px] xl:self-start dark:bg-card/90">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#635BFF] via-violet-400 to-fuchsia-400" />
      <CardHeader className="min-w-0 max-w-full overflow-hidden border-b border-border/60 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 max-w-full items-start gap-3 overflow-hidden">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#635BFF]/10 text-[#635BFF] ring-1 ring-[#635BFF]/15 dark:bg-[#635BFF]/20 dark:text-violet-300">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
            <CardTitle className="truncate text-base">Script settings</CardTitle>
            <CardDescription className="max-w-full leading-relaxed">
              Shape the idea, voice, and pace of your next script.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="min-w-0 w-full max-w-full overflow-hidden p-4 sm:p-5">
        {noIdeas ? (
          <EmptyState
            icon={FileText}
            title="No ideas to script yet"
            description="Generate a few ideas first, then turn your favorite into a polished script."
            action={
              <Button
                asChild
                variant="outline"
                className="max-w-full rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              >
                <Link href="/ideas/generate">
                  <Sparkles />
                  <span className="truncate">Generate ideas</span>
                </Link>
              </Button>
            }
            className="min-w-0 max-w-full overflow-hidden rounded-2xl p-6"
          />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid min-w-0 w-full max-w-full gap-3 overflow-hidden"
            >
              <FormField
                control={form.control}
                name="idea_id"
                render={({ field }) => (
                  <FormItem className="min-w-0 w-full max-w-full space-y-0 overflow-hidden">
                    <SettingCard
                      icon={Lightbulb}
                      label="Idea"
                      helper="Choose the story you want AI to develop."
                      active={Boolean(field.value)}
                    >
                      <IdeaSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        ideas={ideas}
                        loading={loadingIdeas}
                        disabled={disabled}
                      />
                    </SettingCard>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="min-w-0 w-full max-w-full space-y-0 overflow-hidden">
                    <SettingCard
                      icon={MessageCircle}
                      label="Tone"
                      helper="Set how your script should sound and feel."
                      active={Boolean(field.value)}
                    >
                      <ToneSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      />
                    </SettingCard>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="min-w-0 w-full max-w-full space-y-0 overflow-hidden">
                    <SettingCard
                      icon={Clock}
                      label="Duration"
                      helper="Match the script length to your platform."
                      active={Boolean(field.value)}
                    >
                      <DurationSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      />
                    </SettingCard>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={disabled || loadingIdeas}
                className="mt-2 h-12 min-w-0 w-full max-w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#635BFF] to-violet-500 text-white shadow-lg shadow-[#635BFF]/20 transition-all duration-300 hover:scale-[1.015] hover:from-[#5750e6] hover:to-violet-600 hover:shadow-xl hover:shadow-[#635BFF]/25 active:scale-[0.985]"
              >
                {disabled ? (
                  <span className="relative flex size-4 shrink-0 items-center justify-center">
                    <span className="absolute size-4 animate-ping rounded-full bg-white/40" />
                    <Sparkles className="relative size-4 animate-pulse" />
                  </span>
                ) : (
                  <Sparkles className="shrink-0" />
                )}
                <span className="min-w-0 truncate">
                  {disabled ? "Creating your script…" : "Generate script"}
                </span>
                {!disabled ? <ArrowRight className="ml-auto shrink-0" /> : null}
              </Button>
              <p className="max-w-full overflow-hidden text-center text-[11px] text-ellipsis text-muted-foreground">
                CreatorHub AI uses your profile to personalize every draft.
              </p>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

function SettingCard({
  icon: Icon,
  label,
  helper,
  active,
  children,
}: {
  icon: LucideIcon;
  label: string;
  helper: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-border/65 bg-muted/25 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#635BFF]/25 hover:bg-background hover:shadow-md focus-within:border-[#635BFF]/40 focus-within:bg-background focus-within:shadow-md dark:bg-muted/15 dark:hover:bg-muted/25",
        active && "border-[#635BFF]/20",
      )}
    >
      <div className="mb-3 flex min-w-0 max-w-full items-start gap-3 overflow-hidden">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] transition-transform duration-300 group-hover:scale-105 dark:bg-[#635BFF]/20 dark:text-violet-300">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5 overflow-hidden">
          <p className="truncate text-sm font-semibold">{label}</p>
          <p className="max-w-full text-xs leading-relaxed text-muted-foreground">
            {helper}
          </p>
        </div>
      </div>
      <div className="min-w-0 w-full max-w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
