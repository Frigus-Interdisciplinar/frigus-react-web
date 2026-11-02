import { createContext } from "react";

export type TextScale = 100 | 115 | 130;

export type AccessibilityPreferences = {
  textScale: TextScale;
  highContrast: boolean;
  dyslexiaFont: boolean;
  vlibrasEnabled: boolean;
};

export type AccessibilityContextValue = AccessibilityPreferences & {
  setTextScale: (scale: TextScale) => void;
  setHighContrast: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  setVlibrasEnabled: (enabled: boolean) => void;
  resetAccessibility: () => void;
};

export const DEFAULT_PREFERENCES: AccessibilityPreferences = {
  textScale: 100,
  highContrast: false,
  dyslexiaFont: false,
  vlibrasEnabled: false,
};

export const AccessibilityContext =
  createContext<AccessibilityContextValue | null>(null);
