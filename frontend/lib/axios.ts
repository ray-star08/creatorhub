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

// On 401 from auth-check endpoints, clear stale token and bounce to /login.
// For all other endpoints, just reject — callers already show toast on failure.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const url = error.config?.url ?? "";
      const isAuthEndpoint = /\/auth\/(me|login|register)/.test(url);
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
