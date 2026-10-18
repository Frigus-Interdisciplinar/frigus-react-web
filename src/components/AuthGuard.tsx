import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";

const destination: Record<AccountType, string> = {
  DOMESTIC: "/home",
  COMMERCIAL: "/commercial",
  BUSINESS: "/enterprise",
};

export default function AuthGuard({ children, accountType }: { children: ReactNode; accountType?: AccountType }) {
  const { user } = useAuth();
  const initialized = useStore((state) => state.initialized);
  const location = useLocation();

  if (!initialized) {
    return <div className="min-h-screen grid place-items-center text-sm text-gray-500">Carregando sua sessão…</div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (accountType && user.accountType !== accountType) return <Navigate to={destination[user.accountType]} replace />;
  return children;
}
