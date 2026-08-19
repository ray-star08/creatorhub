import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { clearToken, setToken } from "@/lib/auth-token";

interface AuthState {
  user: User | null;
  token: string | null;
  /** True once the persisted state has been read from storage (avoids UI flicker). */
  hasHydrated: boolean;
  login: (user: User, token: string) => void;
  setUser: (user: User) => void;
  refreshToken: (token: string) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      login: (user, token) => {
        setToken(token);
        set({ user, token });
      },
      setUser: (user) => set({ user }),
      refreshToken: (token) => {
        setToken(token);
        set({ token });
      },
      logout: () => {
        clearToken();
        set({ user: null, token: null });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "creatorhub-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Re-sync the guard cookie in case it expired before localStorage did.
        if (state?.token) setToken(state.token);
      },
    },
  ),
);
