"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

import api, { getApiErrorMessage } from "@/lib/axios";
import { unwrapItem, unwrapList } from "@/lib/format";
import { SCRIPT_DURATIONS, SCRIPT_TONES } from "@/lib/constants";
import type { Idea, Script, Task } from "@/lib/types";
import { ScriptPreview } from "@/components/script-preview";
import {
  ScriptSettings,
  type ScriptSettingsValues,
} from "@/components/script-settings";

const schema = z.object({
  idea_id: z.string().min(1, "Choose an idea"),
  tone: z.string().min(1, "Choose a tone"),
  duration: z.string().min(1, "Choose a duration"),
});

const MIN_GENERATION_TIME = 2800;

export function ScriptGenerator({ initialIdeaId }: { initialIdeaId: string }) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [savingToKanban, setSavingToKanban] = useState(false);
  const [savedToKanban, setSavedToKanban] = useState(false);
  const [script, setScript] = useState<Script | null>(null);

  const form = useForm<ScriptSettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      idea_id: initialIdeaId,
      tone: SCRIPT_TONES[0],
      duration: SCRIPT_DURATIONS[2].value,
    },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get<Idea[] | { data: Idea[] }>("/ideas");
        if (active) setIdeas(unwrapList(data));
      } catch {
        // The idea picker displays its own empty state when the API is offline.
      } finally {
        if (active) setLoadingIdeas(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // URL ideaId wins once ideas load; stale/unknown ids fall back to the first idea.
  useEffect(() => {
    if (loadingIdeas || ideas.length === 0) return;
    const exists = ideas.some((idea) => String(idea.id) === initialIdeaId);
    if (!exists) form.setValue("idea_id", String(ideas[0].id), { shouldValidate: true });
  }, [ideas, loadingIdeas, initialIdeaId, form]);

  async function onSubmit(values: ScriptSettingsValues) {
    setGenerating(true);
    setRevealing(false);
    setSavedToKanban(false);

    try {
      const [response] = await Promise.all([
        api.post<Script | { data: Script }>("/scripts/generate", {
          idea_id: Number(values.idea_id),
          tone: values.tone,
          duration: values.duration,
        }),
        new Promise((resolve) => window.setTimeout(resolve, MIN_GENERATION_TIME)),
      ]);

      const result = unwrapItem(response.data);
      if (!result) throw new Error("The API returned an empty script.");

      setScript(result);
      setRevealing(true);
      toast.success("Draft ready — adding the finishing touches.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Script generation failed."));
    } finally {
      setGenerating(false);
    }
  }

  const handleTypingComplete = useCallback(() => {
    setRevealing(false);
  }, []);

  const buildMarkdown = useCallback(() => {
    if (!script) return "";
    return [
      `# ${script.title}`,
      "",
      "## 🔥 Hook",
      "",
      script.hook,
      "",
      "## 📝 Main Content",
      "",
      script.content,
      "",
      "## 📣 Call To Action",
      "",
      script.cta,
    ].join("\n");
  }, [script]);

  async function copyScript() {
    if (!script) return;
    try {
      await navigator.clipboard.writeText(buildMarkdown());
      toast.success("Script copied to clipboard.");
    } catch {
      toast.error("Couldn't copy — please select and copy manually.");
    }
  }

  function exportMarkdown() {
    if (!script) return;

    const blob = new Blob([buildMarkdown()], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const filename =
      script.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "creatorhub-script";

    anchor.href = url;
    anchor.download = `${filename}.md`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success("Markdown exported.");
  }

  async function saveToKanban() {
    if (!script || savedToKanban) return;

    setSavingToKanban(true);
    try {
      await api.post<Task | { data: Task }>("/tasks", {
        title: script.title,
        status: "draft",
      });
      setSavedToKanban(true);
      toast.success("Saved to the Draft column in Kanban.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Couldn't save to Kanban."));
    } finally {
      setSavingToKanban(false);
    }
  }

  function regenerate() {
    void form.handleSubmit(onSubmit)();
  }

  const busy = generating || revealing;

  return (
    <div className="min-w-0 w-full max-w-full space-y-5 overflow-x-hidden">
      <div className="flex min-w-0 max-w-full flex-col gap-3 overflow-hidden sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2 overflow-hidden">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#635BFF]/15 bg-[#635BFF]/8 px-2.5 py-1 text-xs font-medium text-[#635BFF] dark:bg-[#635BFF]/15 dark:text-violet-300">
            <Sparkles className="size-3.5" />
            AI workspace
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Script Generator
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Turn a promising idea into a polished, ready-to-record script.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
          CreatorHub AI online
        </div>
      </div>

      <div className="grid min-w-0 w-full max-w-full grid-cols-1 items-start gap-5 overflow-x-hidden xl:grid-cols-[420px_minmax(0,1fr)]">
        <ScriptSettings
          form={form}
          ideas={ideas}
          loadingIdeas={loadingIdeas}
          disabled={busy}
          onSubmit={onSubmit}
          hasInitialIdea={Boolean(initialIdeaId)}
        />

        <ScriptPreview
          generating={generating}
          script={script}
          disabled={busy}
          savingToKanban={savingToKanban}
          savedToKanban={savedToKanban}
          onCopy={() => void copyScript()}
          onRegenerate={regenerate}
          onExport={exportMarkdown}
          onSaveToKanban={() => void saveToKanban()}
          onTypingComplete={handleTypingComplete}
        />
      </div>
    </div>
  );
}
