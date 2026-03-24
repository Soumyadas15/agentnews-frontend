import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const next = !get().dark;
        set({ dark: next });
        document.documentElement.classList.toggle("dark", next);
      },
    }),
    { name: "agentnews-theme" }
  )
);

// Apply saved theme on load (called once in main.tsx)
export function applyStoredTheme() {
  try {
    const raw = localStorage.getItem("agentnews-theme");
    if (raw) {
      const { state } = JSON.parse(raw);
      if (state?.dark) document.documentElement.classList.add("dark");
    }
  } catch {}
}
