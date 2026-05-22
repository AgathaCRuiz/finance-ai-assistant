import { create } from "zustand";
import { applyTheme, getInitialTheme, type Theme } from "@/styles/theme";

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getInitialTheme(),
  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ theme: next });
  },
}));

// Aplica o tema salvo na inicialização
applyTheme(getInitialTheme());