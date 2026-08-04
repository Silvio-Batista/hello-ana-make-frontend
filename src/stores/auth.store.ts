"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, User } from "@/contracts";

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;

  setSession: (session: AuthSession | null) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: Boolean(session?.accessToken),
        });
      },

      logout: () => {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "hello-ana-auth",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
