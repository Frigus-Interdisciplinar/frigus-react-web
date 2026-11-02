import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Check, Clock3, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/Button";
import {
  getTransaction,
  type Transaction,
} from "@/services/transaction.service";
import { finishPlanSelection, listPlans } from "@/services/plan.service";
import { refreshSession } from "@/services/auth.service";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { useStore } from "@/store/store";
import {
  formatPlanPrice,
  getAccountHome,
  getPlansPath,
} from "@/utils/plan.util";

export default function WebViewSuccess() {
  const [searchParams] = useSearchParams();
  return <TransactionStatusContent key={searchParams.get("transactionId")} />;
}

function TransactionStatusContent() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const saveUser = useStore((state) => state.login);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(Boolean(transactionId));
  const [entering, setEntering] = useState(false);
  const [error, setError] = useState(
    transactionId ? "" : "Não encontramos uma transação para acompanhar.",
  );
  const { data: plans } = useAbortableAsync(listPlans);
  const beginRequest = useLatestRequest();

  useEffect(() => {
    if (!transactionId) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = async () => {
      try {
        const current = await getTransaction(transactionId, controller.signal);
        if (controller.signal.aborted) return;
        setTransaction(current);
        setLoading(false);
        if (["PENDING", "PROCESSING"].includes(current.status))
          timer = setTimeout(() => void refresh(), 1800);
      } catch (reason) {
        if (!controller.signal.aborted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível consultar a transação.",
          );
          setLoading(false);
        }
      }
    };
    void refresh();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [transactionId]);

  const approved = transaction?.status === "APPROVED";
  const rejected =
    transaction &&
    ["REJECTED", "ERROR", "CANCELED"].includes(transaction.status);
  const planName =
    plans?.find((plan) => plan.planCode === transaction?.planCode)?.name ??
    transaction?.planCode ??
    "Plano em confirmação";

  const handleEnterApp = async () => {
    if (!approved || entering) return;
    const signal = beginRequest();
    setEntering(true);
    setError("");
    try {
      const updatedUser = await finishPlanSelection(signal);
      if (signal.aborted) return;
      saveUser(updatedUser);
      const bridge = (
        window as unknown as {
          ReactNativeWebView?: { postMessage: (message: string) => void };
        }
      ).ReactNativeWebView;
      if (typeof bridge?.postMessage === "function")
        bridge.postMessage(
          JSON.stringify({
            type: "PAYMENT_RESULT",
            status: "APPROVED",
            transactionId,
          }),
        );
      else navigate(getAccountHome(updatedUser.accountType), { replace: true });
    } catch (reason) {
      if (!signal.aborted)
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível preparar sua conta. Tente novamente.",
        );
    } finally {
      if (!signal.aborted) setEntering(false);
    }
  };

  const handleChooseAgain = async () => {
    if (!rejected || entering || !user) return;
    const signal = beginRequest();
    setEntering(true);
    setError("");
    try {
      const session = await refreshSession(signal);
      if (signal.aborted) return;
      saveUser(session.user);
      navigate(getPlansPath(session.user.accountType), { replace: true });
    } catch (reason) {
      if (!signal.aborted)
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível voltar aos planos.",
        );
    } finally {
      if (!signal.aborted) setEntering(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-neutral-100 px-0 py-0 dark:bg-[#0B0D12] sm:px-4 sm:py-6">
      <div className="flex min-h-screen w-full max-w-[420px] flex-col justify-between border-x border-slate-200 bg-white shadow-xl dark:border-[#262A33] dark:bg-[#15181E] sm:min-h-[700px] sm:rounded-2xl sm:border">
        <div>
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#262A33]">
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              Confirmação do pagamento
            </h1>
            <ThemeToggle />
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="flex flex-col items-center p-6 text-center"
          >
            <div
              aria-hidden="true"
              className={`mt-6 flex size-16 items-center justify-center rounded-full ${approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : rejected || (error && !transaction) ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}
            >
              {approved ? (
                <Check size={36} />
              ) : rejected || (error && !transaction) ? (
                <X size={36} />
              ) : (
                <Clock3 size={36} />
              )}
            </div>
            <div role="status" className="mt-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {approved
                  ? "Pagamento aprovado"
                  : rejected
                    ? "Pagamento não aprovado"
                    : error && !transaction
                      ? "Não foi possível consultar o pagamento"
                      : "Aguardando confirmação"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                {approved
                  ? "Seu plano foi ativado. Continue para acessar sua conta."
                  : rejected
                    ? "Seu plano ainda não foi ativado. Você pode escolher outro plano e tentar novamente."
                    : "Seu plano será ativado quando o pagamento for aprovado."}
              </p>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              Transação de demonstração. Nenhuma cobrança real foi feita.
            </p>
            {loading && (
              <p role="status" className="mt-3 text-sm text-text-muted">
                Consultando transação…
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </p>
            )}
            {transaction && (
              <dl className="mt-8 w-full space-y-4 rounded-2xl bg-slate-50 p-5 text-left dark:bg-[#1C1E24]">
                <div>
                  <dt className="text-xs text-text-muted">Plano</dt>
                  <dd className="mt-1 font-bold text-slate-900 dark:text-white">
                    {planName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted">
                    Valor da transação
                  </dt>
                  <dd className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {transaction.amount == null
                      ? "Não informado"
                      : formatPlanPrice(transaction.amount)}
                  </dd>
                </div>
              </dl>
            )}
            {error && !transaction && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 min-h-11 rounded-lg border px-4 font-semibold"
              >
                Tentar novamente
              </button>
            )}
          </main>
        </div>
        <div className="space-y-3 border-t border-slate-200 p-4 dark:border-[#262A33]">
          {rejected ? (
            <Button
              type="button"
              disabled={entering}
              onClick={() => void handleChooseAgain()}
              className="min-h-12 w-full"
            >
              {entering
                ? "Voltando aos planos…"
                : "Escolher plano e tentar novamente"}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!approved || entering}
              onClick={() => void handleEnterApp()}
              className="min-h-12 w-full"
            >
              {entering
                ? "Preparando sua conta…"
                : approved
                  ? "Continuar para o Frigus"
                  : "Aguardando confirmação"}
            </Button>
          )}
          {!transactionId && user && (
            <Link
              to={getPlansPath(user.accountType)}
              className="block py-2 text-center text-sm font-semibold text-frigus-primary underline dark:text-[#A7BCFF]"
            >
              Voltar aos planos
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
