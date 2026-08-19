"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

import api, { getApiErrorMessage } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import type { AuthResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", values);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      router.replace(redirectTo);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  }

  async function demoLogin() {
    setDemoLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/demo");
      login(data.user, data.token);
      toast.success("Your personal demo workspace is ready.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not start demo. Please try again."));
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your CreatorHub workspace to keep creating.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2 w-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 border-t pt-4">
          <Button
            variant="outline"
            className="w-full border-primary/40 text-primary hover:bg-primary/5"
            onClick={demoLogin}
            disabled={demoLoading}
          >
            {demoLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {demoLoading ? "Loading demo…" : "Quick Demo Access (For Judges)"}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
