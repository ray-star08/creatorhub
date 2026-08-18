/**
 * Single source of truth for the Sanctum bearer token on the client.
 *
 * The token lives in two places on purpose:
 *  - `localStorage` — read by the axios interceptor to authorize API calls.
 *  - a cookie       — read by `proxy.ts` (runs on the server) to guard routes.
 *
 * Keep both in sync through these helpers only.
 */
export const TOKEN_KEY = "ch_token";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
}
