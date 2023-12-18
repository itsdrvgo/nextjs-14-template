import { create } from "zustand";

interface ThemeState {
    theme: "dark" | "light";
    setTheme: (value: "dark" | "light") => void;
}

const useThemeStore = create<ThemeState>((set) => ({
    theme: "dark",
    setTheme: (value) => set({ theme: value }),
}));

export default useThemeStore;
