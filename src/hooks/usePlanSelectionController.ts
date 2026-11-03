import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { useServiceOperations } from "@/hooks/useServiceOperations";
import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";
import type { Plan } from "@/types/plan.type";
import {
  getAccountHome,
  getSessionDestination,
  isPlanAvailableForAccount,
} from "@/utils/plan.util";

export function usePlanSelectionController(accountType: AccountType) {
  const apiOperations = useServiceOperations();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const saveUser = useStore((state) => state.login);
  const [activating, setActivating] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const beginRequest = useLatestRequest();
  const loadPlans = useCallback(
    (signal: AbortSignal) => apiOperations.plans.listPlans(signal),
    [apiOperations.plans],
  );
  const { data, loading, error: loadError, reload } =
    useAbortableAsync(loadPlans);
  const plans = useMemo(
    () =>
      (data ?? [])
        .filter(
          (plan) =>
            plan.active && isPlanAvailableForAccount(plan.planCode, accountType),
        )
        .sort((left, right) => left.price - right.price),
    [accountType, data],
  );

  const handleChoosePlan = useCallback(
    async (plan: Plan) => {
      if (activating) return;
      if (plan.price > 0) {
        navigate(`/checkout?plan=${encodeURIComponent(plan.planCode)}`);
        return;
      }
      const signal = beginRequest();
      setActivating(plan.planCode);
      setActionError("");
      try {
        const transaction = await apiOperations.transactions.createCheckoutTransaction(
          { planCode: plan.planCode },
          signal,
        );
        if (transaction.status !== "APPROVED")
          throw new Error(
            "Não foi possível ativar o plano gratuito. Tente novamente.",
          );
        const updatedUser = await apiOperations.plans.finishPlanSelection(signal);
        if (signal.aborted) return;
        saveUser(updatedUser);
        navigate(getAccountHome(updatedUser.accountType), { replace: true });
      } catch (reason) {
        if (!signal.aborted)
          setActionError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível escolher o plano.",
          );
      } finally {
        if (!signal.aborted) setActivating(null);
      }
    },
    [
      activating,
      apiOperations.plans,
      apiOperations.transactions,
      beginRequest,
      navigate,
      saveUser,
    ],
  );

  return {
    accountType,
    planSelectionRequired: user?.planSelectionRequired === true,
    redirectTo:
      user?.planSelectionRequired && user.pendingPlanTransactionId
        ? getSessionDestination(user)
        : null,
    plans,
    loading,
    loadError,
    actionError,
    activating,
    onRetry: reload,
    onChoosePlan: handleChoosePlan,
  };
}
