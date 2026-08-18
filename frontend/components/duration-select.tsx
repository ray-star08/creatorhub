"use client";

import { SCRIPT_DURATIONS } from "@/lib/constants";
import {
  SCRIPT_SELECT_CONTENT_CLASS,
  SCRIPT_SELECT_ITEM_CLASS,
  SCRIPT_SELECT_TRIGGER_CLASS,
} from "@/components/idea-select";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DurationSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
}

export function DurationSelect({
  value,
  onValueChange,
  disabled,
}: DurationSelectProps) {
  return (
    <div className="min-w-0 w-full max-w-full overflow-hidden">
      <FormLabel className="sr-only">Duration</FormLabel>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger className={SCRIPT_SELECT_TRIGGER_CLASS}>
            <SelectValue placeholder="Select a duration" />
          </SelectTrigger>
        </FormControl>
        <SelectContent
          position="popper"
          align="start"
          sideOffset={6}
          className={SCRIPT_SELECT_CONTENT_CLASS}
        >
          {SCRIPT_DURATIONS.map((duration) => (
            <SelectItem
              key={duration.value}
              value={duration.value}
              className={SCRIPT_SELECT_ITEM_CLASS}
            >
              <span className="block min-w-0 max-w-full truncate">
                {duration.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage className="mt-2" />
    </div>
  );
}
