import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LoadingSpinner from "@/components/LoadingSpinner";
import BrandLogo from "@/components/BrandLogo";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { useLatestRequest } from "@/hooks/useLatestRequest";


import { useStore } from "@/store/store";
import type { AccountType } from "@/types/auth.type";
import type { Plan } from "@/types/plan.type";
import {
  formatPlanPrice,
  getAccountHome,
  getSessionDestination,
  isPlanAvailableForAccount,
} from "@/utils/plan.util";
import { useServiceOperations } from "@/hooks/useServiceOperations";

const accountLabels: Record<AccountType, string> = {
  DOMESTIC: "sua casa",
  COMMERCIAL: "seu comércio",
  BUSINESS: "sua empresa",
};

export default function PlanSelection({
  accountType,
}: {
  accountType: AccountType;
}) {
  const apiOperations = useServiceOperations();
  const { data, loading, error: loadError } = useAbortableAsync(apiOperations.plans.listPlans);
  const plans = (data ?? [])
    .filter(
      (plan) =>
        plan.active && isPlanAvailableForAccount(plan.planCode, accountType),
    )
    .sort((a, b) => a.price - b.price);
  const user = useStore((state) => state.user);
  const saveUser = useStore((state) => state.login);
  const [activating, setActivating] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const beginRequest = useLatestRequest();
  const navigate = useNavigate();

  const handleChoosePlan = async (plan: Plan) => {
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
  };

  if (user?.planSelectionRequired && user.pendingPlanTransactionId)
    return <Navigate to={getSessionDestination(user)} replace />;

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-6 text-frigus-navy dark:bg-[#0F172A] dark:text-white sm:p-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-[#E1E7F0] pb-6 dark:border-[#343941]">
        <Link to="/" aria-label="Frigus">
          <BrandLogo surface="theme" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          {user?.planSelectionRequired && (
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-frigus-primary dark:border-blue-900/40 dark:bg-[#1B2A4A] dark:text-[#A7BCFF]">
              Etapa 2 de 2
            </span>
          )}
          <ThemeToggle />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto max-w-6xl py-10 sm:py-14"
      >
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Escolha o plano para {accountLabels[accountType]}
          </h1>
          <p className="mt-3 text-base text-text-muted">
            {user?.planSelectionRequired
              ? "Seu cadastro está pronto. Escolha um plano para começar."
              : "Compare os planos disponíveis para sua conta."}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            O plano gratuito libera o acesso direto. Planos pagos seguem para o
            checkout.
          </p>
        </div>
        {loading && (
          <LoadingSpinner label="Carregando planos…" className="min-h-48" />
        )}
        {loadError && (
          <div role="alert" className="mx-auto max-w-xl space-y-3 text-center">
            <p>{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border px-4 py-3 font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {actionError && (
          <p
            role="alert"
            className="mb-6 text-center text-sm text-red-700 dark:text-red-300"
          >
            {actionError}
          </p>
        )}
        {!loading && !loadError && plans.length === 0 && (
          <p role="status" className="text-center text-text-muted">
            Não há planos disponíveis para este tipo de conta no momento.
          </p>
        )}
        <div
          className={`grid gap-6 ${plans.length < 3 ? "mx-auto max-w-4xl md:grid-cols-2" : "md:grid-cols-3"}`}
        >
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="flex flex-col rounded-2xl border border-[#C9DEF9] bg-white p-7 shadow-sm dark:border-[#343941] dark:bg-[#1C1E22]"
            >
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {plan.description}
              </p>
              <p className="mt-6 text-3xl font-bold">
                {formatPlanPrice(plan.price)}
                <span className="ml-1 text-sm font-normal text-text-muted">
                  {plan.price === 0
                    ? " · grátis"
                    : plan.billingInterval === "YEARLY"
                      ? "/ano"
                      : plan.billingInterval === "MONTHLY"
                        ? "/mês"
                        : ""}
                </span>
              </p>
              <ul className="my-7 flex-1 space-y-3 text-sm">
                {plan.benefits
                  .filter((benefit) => benefit.enabled)
                  .map((benefit) => (
                    <li key={benefit.code} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-frigus-primary dark:text-[#A7BCFF]"
                      />
                      <span>
                        {benefit.label}
                        {benefit.limit == null
                          ? ""
                          : `: ${benefit.limit === 2147483647 ? "ilimitado" : benefit.limit.toLocaleString("pt-BR")}`}
                      </span>
                    </li>
                  ))}
              </ul>
              <button
                type="button"
                disabled={activating !== null}
                onClick={() => void handleChoosePlan(plan)}
                className="min-h-12 w-full rounded-xl bg-frigus-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
              >
                {activating === plan.planCode
                  ? "Ativando plano…"
                  : plan.price === 0
                    ? "Começar grátis"
                    : `Escolher ${plan.name}`}
              </button>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
