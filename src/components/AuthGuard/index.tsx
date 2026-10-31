import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSessionDestination } from "@/utils/plan.util";

const destination: Record<AccountType, string> = {
  DOMESTIC: "/home",
  COMMERCIAL: "/commercial",
  BUSINESS: "/enterprise",
};

interface AuthGuardProps {
  children: ReactNode;
  accountType?: AccountType;
  allowPlanSelection?: boolean;
}

export default function AuthGuard({
  children,
  accountType,
  allowPlanSelection = false,
}: AuthGuardProps) {
  const { user } = useAuth();
  const initialized = useStore((state) => state.initialized);
  const location = useLocation();

  if (!initialized) {
    return (
      <LoadingSpinner label="Carregando sua sessão…" className="min-h-[45vh]" />
    );
  }
  if (!user)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  if (user.planSelectionRequired && !allowPlanSelection)
    return <Navigate to={getSessionDestination(user)} replace />;
  if (accountType && user.accountType !== accountType)
    return (
      <Navigate
        to={
          user.planSelectionRequired
            ? getSessionDestination(user)
            : destination[user.accountType]
        }
        replace
      />
    );
  return children;
}
