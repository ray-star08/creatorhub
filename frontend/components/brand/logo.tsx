import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  /** Size of the mark in pixels-ish tailwind size units (default 8 = 2rem). */
  markClassName?: string;
}

export function Logo({ className, showText = true, markClassName }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2 font-semibold", className)}>
      <span
        className={cn(
          "bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-sm",
          markClassName,
        )}
      >
        <Sparkles className="size-4" />
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">CreatorHub</span>
      )}
    </span>
  );
}
