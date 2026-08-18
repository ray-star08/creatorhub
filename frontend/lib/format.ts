/** Two-letter initials for avatars; falls back to the CreatorHub mark. */
export function getInitials(name?: string | null): string {
  if (!name) return "CH";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials || "CH";
}

/** Time-of-day greeting. Call on the client to avoid SSR/CSR mismatch. */
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * Laravel API resources may return a bare array or a `{ data: [...] }`
 * envelope. Normalize both to a plain array.
 */
export function unwrapList<T>(
  payload: T[] | { data?: T[] } | null | undefined,
): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

/** Unwrap a single resource that may be wrapped in `{ data: {...} }`. */
export function unwrapItem<T>(payload: T | { data?: T } | null | undefined): T | null {
  if (payload == null) return null;
  if (typeof payload === "object" && "data" in payload && (payload as { data?: T }).data) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
