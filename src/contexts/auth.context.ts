import { createContext } from "react";
import type { AuthUser } from "@/types/auth.type";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initialized: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
