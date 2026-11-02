import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import {
  AccessibilityContext,
  DEFAULT_PREFERENCES,
  type AccessibilityPreferences,
  type AccessibilityContextValue,
} from "@/contexts/accessibility-context";

const STORAGE_KEY = "frigus-accessibility-preferences";

function readPreferences(): AccessibilityPreferences {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(saved) as Partial<AccessibilityPreferences>;
    return {
      textScale:
        parsed.textScale === 115 || parsed.textScale === 130
          ? parsed.textScale
          : 100,
      highContrast: parsed.highContrast === true,
      dyslexiaFont: parsed.dyslexiaFont === true,
      vlibrasEnabled: parsed.vlibrasEnabled === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(readPreferences);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.textScale = String(preferences.textScale);
    root.dataset.highContrast = String(preferences.highContrast);
    root.dataset.dyslexiaFont = String(preferences.dyslexiaFont);
    root.dataset.vlibrasEnabled = String(preferences.vlibrasEnabled);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Preferences still work for this session when storage is unavailable.
    }
  }, [preferences]);

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
