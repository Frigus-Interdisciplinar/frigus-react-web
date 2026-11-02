import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem("frigus-theme");
    if (saved === "light" || saved === "dark") return saved;
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (
        parsed &&
        typeof parsed === "object" &&
        "theme" in parsed &&
        (parsed.theme === "light" || parsed.theme === "dark") &&
        "_versao" in parsed &&
        parsed._versao === 1
      )
        return parsed.theme;
    }
  } catch {
    // tema em memória quando o armazenamento está bloqueado ou corrompido
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(
        "frigus-theme",
        JSON.stringify({ _versao: 1, theme }),
      );
    } catch {
      // O tema funciona em memória quando o armazenamento está bloqueado.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }, []);
  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
