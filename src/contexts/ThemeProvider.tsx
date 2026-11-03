import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext, type Theme } from "./ThemeContext";
import { z } from "zod";
import type { ProviderProps } from "@/types/component-props.type";

const THEME_SCHEMA = z.enum(["light", "dark"]);
const VERSIONED_THEME_SCHEMA = z.object({
  _versao: z.literal(1),
  theme: THEME_SCHEMA,
});

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem("frigus-theme");
    if (!saved) return getSystemTheme();
    const legacyTheme = THEME_SCHEMA.safeParse(saved);
    if (legacyTheme.success) return legacyTheme.data;
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      const versioned = VERSIONED_THEME_SCHEMA.safeParse(parsed);
      if (versioned.success) return versioned.data.theme;
    }
  } catch {
    // tema em memória quando o armazenamento está bloqueado ou corrompido
  }
  return getSystemTheme();
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: ProviderProps) {
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
  // Evita notificar todos os consumidores do contexto em renders sem mudança de tema.
  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
