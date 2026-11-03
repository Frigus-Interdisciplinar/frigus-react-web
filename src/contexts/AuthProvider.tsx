import { useMemo } from "react";
import { useStore } from "@/store/store";
import { AuthContext } from "@/contexts/auth.context";
import type { ProviderProps } from "@/types/component-props.type";

export function AuthProvider({ children }: ProviderProps) {
  const user = useStore((state) => state.user);
  // Preserva a referência do contexto enquanto o usuário não muda.
  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null }),
    [user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
