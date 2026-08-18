"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Client-side companion to `proxy.ts`. Waits for the persisted auth state to
 * hydrate, then renders the app shell (or bounces to /login if the session is
 * gone). Prevents a flash of unauthenticated UI on hard refresh.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-svh flex-1 items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return null; // redirecting to /login
  }

  return <>{children}</>;
}
