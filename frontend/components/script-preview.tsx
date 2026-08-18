"use client";

import type { Script } from "@/lib/types";
import { GenerationProgress } from "@/components/scripts/generation-progress";
import { ScriptEmptyState } from "@/components/scripts/script-empty-state";
import { ScriptOutput } from "@/components/scripts/script-output";

interface ScriptPreviewProps {
  generating: boolean;
  script: Script | null;
  disabled: boolean;
  savingToKanban: boolean;
  savedToKanban: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onExport: () => void;
  onSaveToKanban: () => void;
  onTypingComplete: () => void;
}

export function ScriptPreview({
  generating,
  script,
  disabled,
  savingToKanban,
  savedToKanban,
  onCopy,
  onRegenerate,
  onExport,
  onSaveToKanban,
  onTypingComplete,
}: ScriptPreviewProps) {
  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden">
      {generating ? (
        <GenerationProgress />
      ) : script ? (
        <ScriptOutput
          key={`${script.id}-${script.updated_at ?? script.hook}`}
          script={script}
          disabled={disabled}
          savingToKanban={savingToKanban}
          savedToKanban={savedToKanban}
          onCopy={onCopy}
          onRegenerate={onRegenerate}
          onExport={onExport}
          onSaveToKanban={onSaveToKanban}
          onTypingComplete={onTypingComplete}
        />
      ) : (
        <ScriptEmptyState />
      )}
    </div>
  );
}
