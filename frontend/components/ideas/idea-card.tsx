import Link from "next/link";
import { FileText, TrendingUp } from "lucide-react";

import type { Idea } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function IdeaCard({ idea }: { idea: Idea }) {
  const score = Math.max(0, Math.min(100, idea.engagement_score ?? 0));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base leading-snug">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {idea.description}
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3.5" />
              Predicted engagement
            </span>
            <span className="font-medium tabular-nums">
              {score}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          <Progress value={score} className="h-1.5" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/scripts/generate?ideaId=${idea.id}`}>
            <FileText />
            Create script from idea
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
