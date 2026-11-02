import { useContext } from "react";
import { AccessibilityContext } from "@/contexts/accessibility-context";

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      "useAccessibility precisa estar dentro de AccessibilityProvider",
    );
  return context;
}
