import type { ReactNode } from "react";
import { useStore } from "@/store/store";
import { AuthContext } from "@/contexts/auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useStore((state) => state.user);
  return <AuthContext.Provider value={{ user, isAuthenticated: user !== null }}>{children}</AuthContext.Provider>;
}
