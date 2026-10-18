import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("frigus-theme");
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && "theme" in parsed &&
            (parsed.theme === "light" || parsed.theme === "dark") &&
            "_versao" in parsed && parsed._versao === 1) return parsed.theme;
        } catch {
          // Migrate the previous plain-string representation below.
        }
        if (saved === "light" || saved === "dark") return saved;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("frigus-theme", JSON.stringify({ _versao: 1, theme }));
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
