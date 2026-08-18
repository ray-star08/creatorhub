import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  loading?: boolean;
  accentClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  accentClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            accentClassName ?? "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
