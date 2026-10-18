import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { AuthProvider, ThemeProvider } from "@/contexts";
import { refreshSession } from "@/services/auth.service";
import { useStore } from "@/store/store";

let sessionBootstrap: Promise<void> | null = null;

export default function App() {
  const saveUser = useStore((state) => state.login);
  const setInitialized = useStore((state) => state.setInitialized);

  useEffect(() => {
    sessionBootstrap ??= refreshSession()
      .then((session) => saveUser(session.user))
      .catch(() => useStore.getState().logout())
      .finally(() => setInitialized(true));
  }, [saveUser, setInitialized]);

  useEffect(() => {
    const clearExpiredSession = () => useStore.getState().logout();
    window.addEventListener("frigus:session-expired", clearExpiredSession);
    return () => window.removeEventListener("frigus:session-expired", clearExpiredSession);
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
