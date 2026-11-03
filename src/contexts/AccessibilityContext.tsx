import { useLayoutEffect, useMemo, useState } from "react";
import {
  AccessibilityContext,
  DEFAULT_PREFERENCES,
  type AccessibilityPreferences,
  type AccessibilityContextValue,
} from "@/contexts/accessibility-context";
import { z } from "zod";
import type { ProviderProps } from "@/types/provider-component-props.type";

const STORAGE_KEY = "frigus-accessibility-preferences";
const PREFERENCES_SCHEMA = z.object({
  textScale: z.union([z.literal(100), z.literal(115), z.literal(130)]),
  highContrast: z.boolean(),
  dyslexiaFont: z.boolean(),
  vlibrasEnabled: z.boolean(),
});
const VERSIONED_PREFERENCES_SCHEMA = z.object({
  _versao: z.literal(1),
  preferences: PREFERENCES_SCHEMA,
});

function readPreferences(): AccessibilityPreferences {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PREFERENCES;

    const parsed: unknown = JSON.parse(saved);
    const versioned = VERSIONED_PREFERENCES_SCHEMA.safeParse(parsed);
    if (versioned.success) return versioned.data.preferences;

    // Migra o formato legado validado; formatos desconhecidos são descartados.
    const legacy = PREFERENCES_SCHEMA.safeParse(parsed);
    return legacy.success ? legacy.data : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function AccessibilityProvider({ children }: ProviderProps) {
  const [preferences, setPreferences] = useState(readPreferences);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.textScale = String(preferences.textScale);
    root.dataset.highContrast = String(preferences.highContrast);
    root.dataset.dyslexiaFont = String(preferences.dyslexiaFont);
    root.dataset.vlibrasEnabled = String(preferences.vlibrasEnabled);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ _versao: 1, preferences }),
      );
    } catch {
      // Preferences still work for this session when storage is unavailable.
    }
  }, [preferences]);

  // Mantém o valor do contexto estável quando apenas o provider renderiza novamente.
  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...preferences,
      setTextScale: (textScale) =>
        setPreferences((current) => ({ ...current, textScale })),
      setHighContrast: (highContrast) =>
        setPreferences((current) => ({ ...current, highContrast })),
      setDyslexiaFont: (dyslexiaFont) =>
        setPreferences((current) => ({ ...current, dyslexiaFont })),
      setVlibrasEnabled: (vlibrasEnabled) =>
        setPreferences((current) => ({ ...current, vlibrasEnabled })),
      resetAccessibility: () => setPreferences(DEFAULT_PREFERENCES),
    }),
    [preferences],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}
