"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side companion to `proxy.ts`. Waits for the persisted auth state to
 * hydrate AND confirms an active Supabase session before rendering the app
 * shell — pages never fire API fetches until the session is confirmed valid.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!hasHydrated || !token) {
      setSessionReady(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const store = useAuthStore.getState();
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        let accessToken = data.session?.access_token ?? null;

        if (!accessToken) {
          const { data: refreshed } = await supabase.auth.refreshSession();
          accessToken = refreshed.session?.access_token ?? null;
        }

        if (!accessToken) {
          store.logout(); // stale persisted session
          router.replace("/login");
          return;
        }

        if (accessToken !== token) {
          store.refreshToken(accessToken);
        }
      } catch {
        // network hiccup: let the request-layer 401 retry handle it
      }

      if (!cancelled) setSessionReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, token, router]);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated || (token && !sessionReady)) {
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
