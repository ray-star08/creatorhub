"use client";

import type { Idea } from "@/lib/types";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export const SCRIPT_SELECT_TRIGGER_CLASS =
  "h-11 min-w-0 w-full max-w-full overflow-hidden rounded-xl border-border/70 bg-background/80 px-3 shadow-xs transition-all duration-300 hover:border-[#635BFF]/40 hover:bg-background focus-visible:border-[#635BFF] focus-visible:ring-[#635BFF]/15 dark:bg-background/40 dark:hover:bg-background/60 [&_[data-slot=select-value]]:min-w-0 [&_[data-slot=select-value]]:max-w-full [&_[data-slot=select-value]]:flex-1 [&_[data-slot=select-value]]:truncate [&_[data-slot=select-value]]:text-left";

export const SCRIPT_SELECT_CONTENT_CLASS =
  "z-[100] min-w-0 w-[var(--radix-select-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl shadow-xl duration-300 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95";

export const SCRIPT_SELECT_ITEM_CLASS =
  "min-w-0 max-w-full overflow-hidden py-2.5 pr-8 transition-colors duration-200";

interface IdeaSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  ideas: Idea[];
  loading: boolean;
  disabled: boolean;
}

export function IdeaSelect({
  value,
  onValueChange,
  ideas,
  loading,
  disabled,
}: IdeaSelectProps) {
  const selectedIdea = ideas.find((idea) => String(idea.id) === value);

  if (loading) {
    return (
      <div className="min-w-0 w-full max-w-full overflow-hidden">
        <FormLabel className="sr-only">Idea</FormLabel>
        <Skeleton className="h-11 w-full max-w-full rounded-xl" />
        <span className="sr-only" role="status">
          Loading your ideas
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden">
      <FormLabel className="sr-only">Idea</FormLabel>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger
            className={SCRIPT_SELECT_TRIGGER_CLASS}
            title={selectedIdea?.title}
          >
            <SelectValue placeholder="Select an idea" />
          </SelectTrigger>
        </FormControl>
        <SelectContent
          position="popper"
          align="start"
          sideOffset={6}
          className={SCRIPT_SELECT_CONTENT_CLASS}
        >
          {ideas.map((idea) => (
            <SelectItem
              key={idea.id}
              value={String(idea.id)}
              className={SCRIPT_SELECT_ITEM_CLASS}
              title={idea.title}
            >
              <span className="block min-w-0 max-w-full truncate">
                {idea.title}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage className="mt-2" />
    </div>
  );
}
