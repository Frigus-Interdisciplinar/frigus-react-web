import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { AuthProvider, ThemeProvider } from "@/contexts";
import { ensureStarterWorkspace, refreshSession } from "@/services/auth.service";
import { useStore } from "@/store/store";
import AccessibilityTools from "@/components/AccessibilityTools";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import DocumentTitle from "@/components/DocumentTitle";

let sessionBootstrap: ReturnType<typeof refreshSession> | null = null;

export default function App() {
  const saveUser = useStore((state) => state.login);
  const setInitialized = useStore((state) => state.setInitialized);
  const [workspaceError, setWorkspaceError] = useState("");

  useEffect(() => {
    if (useStore.getState().initialized) return;
    let active = true;
    sessionBootstrap ??= refreshSession().finally(() => {
      sessionBootstrap = null;
    });
    void sessionBootstrap
      .then(async (session) => {
        if (!active || useStore.getState().initialized) return;
        if (!session.user.planSelectionRequired) {
          try {
            await ensureStarterWorkspace(session.user.accountType);
          } catch {
            if (active && !useStore.getState().initialized) setWorkspaceError("Não foi possível preparar seu espaço. Recarregue a página para tentar novamente.");
          }
        }
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
            {workspaceError ? <main id="main-content" tabIndex={-1} className="mx-auto max-w-lg space-y-4 p-8 text-center text-text-main"><h1 className="text-xl font-bold">Não foi possível preparar sua conta</h1><p role="alert">{workspaceError}</p><button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-frigus-primary px-5 py-3 font-semibold text-white">Tentar novamente</button></main> : <AppRoutes />}
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}
