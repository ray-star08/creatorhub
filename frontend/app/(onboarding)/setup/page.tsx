"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

import api, { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Profile } from "@/lib/types";
import { CONTENT_STYLES, PLATFORMS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  niche: z.string().min(2, "Tell us your niche"),
  platform: z.string().min(1, "Pick your main platform"),
  audience: z.string().min(3, "Describe your audience"),
  style: z.string().min(1, "Choose a content style"),
});

type FormValues = z.infer<typeof schema>;

export default function SetupPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { niche: "", platform: "", audience: "", style: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await api.post<{ profile: Profile }>("/profile/setup", values);
      toast.success("You're all set — welcome to CreatorHub!");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save your profile."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-2">
        <span className="bg-accent text-accent-foreground inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
          <Sparkles className="size-3.5" />
          Quick setup · under a minute
        </span>
        <CardTitle className="text-2xl">
          {user?.name ? `Hi ${user.name.split(" ")[0]}, ` : ""}let&apos;s
          personalize your studio
        </CardTitle>
        <CardDescription>
          We use this to tailor every AI idea and script to your voice and
          audience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your niche</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Personal finance for Gen Z"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main platform</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PLATFORMS.map((platform) => (
                          <SelectItem key={platform} value={platform}>
                            {platform}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content style</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTENT_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your audience</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Who are you creating for? e.g. College students who want to start investing with small budgets."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The more specific, the sharper your AI results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Saving…" : "Enter my studio"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
