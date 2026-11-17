import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/types";

export type { User };

interface AuthState {
  user: null | User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }, false, "auth/setUser"),
      logout: () => set({ user: null }, false, "auth/logout"),
    }),
    { name: "AuthStore" }
  )
);