import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { AuthProvider, ThemeProvider } from "@/contexts";
import { refreshSession } from "@/services/auth.service";
import { useStore } from "@/store/store";
import AccessibilityTools from "@/components/AccessibilityTools";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import DocumentTitle from "@/components/DocumentTitle";

let sessionBootstrap: ReturnType<typeof refreshSession> | null = null;

export default function App() {
  const saveUser = useStore((state) => state.login);
  const setInitialized = useStore((state) => state.setInitialized);

  useEffect(() => {
    if (useStore.getState().initialized) return;
    let active = true;
    sessionBootstrap ??= refreshSession().finally(() => {
      sessionBootstrap = null;
    });
    void sessionBootstrap
      .then((session) => {
        if (!active || useStore.getState().initialized) return;
        if (active && !useStore.getState().initialized) saveUser(session.user);
      })
      .catch(() => {
        if (active && !useStore.getState().initialized)
          useStore.getState().logout();
      })
      .finally(() => {
        if (active) setInitialized(true);
      });
    return () => {
      active = false;
    };
  }, [saveUser, setInitialized]);

  useEffect(() => {
    const clearExpiredSession = () => useStore.getState().logout();
    window.addEventListener("frigus:session-expired", clearExpiredSession);
    return () =>
      window.removeEventListener("frigus:session-expired", clearExpiredSession);
  }, []);

  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <BrowserRouter>
          <DocumentTitle />
          <AccessibilityTools />
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}
