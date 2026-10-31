import { useMemo, type ReactNode } from "react";
import { useStore } from "@/store/store";
import { AuthContext } from "@/contexts/auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useStore((state) => state.user);
  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
