import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "@/lib/auth-token";

/**
 * Pre-configured axios instance for the CreatorHub Laravel API.
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.local).
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Attach the Sanctum bearer token to every request when present.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: refresh the Supabase session once and retry. If refresh fails on an
// auth-check endpoint, clear stale token and bounce to /login.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const config = error.config as (typeof error.config & { _retried?: boolean }) | undefined;
      const url = config?.url ?? "";
      const isAuthEndpoint = /\/auth\/(me|login|register|demo)/.test(url);

      if (config && !config._retried && !isAuthEndpoint) {
        config._retried = true;
        try {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          const { data } = await supabase.auth.refreshSession();
          const token = data.session?.access_token;
          if (token) {
            const { useAuthStore } = await import("@/stores/useAuthStore");
            useAuthStore.getState().refreshToken(token);
            config.headers.Authorization = `Bearer ${token}`;
            return api(config);
          }
        } catch {
          // fall through to reject
        }
      }

      if (isAuthEndpoint) {
        clearToken();
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

/** Best-effort extraction of a human-readable message from an API error. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors)[0];
      if (first?.[0]) return first[0];
    }
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return fallback;
}

export default api;
