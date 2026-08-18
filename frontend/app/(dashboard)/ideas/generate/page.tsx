"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

import api, { getApiErrorMessage } from "@/lib/axios";
import { unwrapList } from "@/lib/format";
import type { Idea } from "@/lib/types";
import { PageHeader } from "@/components/layout/page-header";
import { IdeaCard } from "@/components/ideas/idea-card";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  topic: z.string().min(2, "Enter a topic to brainstorm"),
});

type FormValues = z.infer<typeof schema>;

function extractIdeas(
  payload: Idea[] | { ideas?: Idea[]; data?: Idea[] },
): Idea[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.ideas)) return payload.ideas;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

function IdeaCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

export default function IdeasGeneratePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [generating, setGenerating] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: "" },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await api.get<Idea[] | { data: Idea[] }>("/ideas");
        if (active) setIdeas(unwrapList(data));
      } catch {
        // Backend offline — start with an empty board.
      } finally {
        if (active) setLoadingList(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(values: FormValues) {
    setGenerating(true);
    try {
      const { data } = await api.post<
        Idea[] | { ideas?: Idea[]; data?: Idea[] }
      >("/ideas/generate", { ...values, count: 3 });
      const fresh = extractIdeas(data);
      setIdeas((prev) => [...fresh, ...prev]);
      toast.success(
        `Generated ${fresh.length} new idea${fresh.length === 1 ? "" : "s"}.`,
      );
      form.reset({ topic: "" });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Idea generation failed."));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Idea Generator"
        description="Describe a topic and let AI brainstorm on-brand content ideas for you."
      />

      <Card>
        <CardContent className="p-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. Beginner investing mistakes to avoid"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                disabled={generating}
                className="sm:w-auto"
              >
                {generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {generating ? "Generating…" : "Generate ideas"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Your ideas</h2>

        {generating ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
          </div>
        ) : loadingList ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
            <IdeaCardSkeleton />
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Lightbulb}
            title="No ideas yet"
            description="Enter a topic above and hit generate to fill your board with fresh, on-brand ideas."
          />
        )}
      </section>
    </div>
  );
}
