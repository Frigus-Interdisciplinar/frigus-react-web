import { useMemo } from "react";
import { useStore } from "@/store/store";
import { AuthContext } from "@/contexts/auth.context";
import type { ProviderProps } from "@/types/provider-component-props.type";

export function AuthProvider({ children }: ProviderProps) {
  const user = useStore((state) => state.user);
  const initialized = useStore((state) => state.initialized);
  // Preserva a referência do contexto enquanto o usuário não muda.
  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, initialized }),
    [initialized, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
