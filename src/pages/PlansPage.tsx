/* eslint-disable react-hooks/set-state-in-effect -- This effect loads async API data into view state. */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import WorkspaceLayout from "@/components/WorkspaceLayout";
import { planService } from "@/services/plan.service";
import { transactionService } from "@/services/transaction.service";
import { useStore } from "@/store/store";
import type { z } from "zod";
import { planSchema, subscriptionSchema, transactionSchema } from "@/schemas/api.schema";

type Plan = z.output<typeof planSchema>;
type Subscription = z.output<typeof subscriptionSchema>;
type Transaction = z.output<typeof transactionSchema>;

export default function PlansPage() {
  const user = useStore((s) => s.user);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "BOLETO" | "CREDIT_CARD">("PIX");
  const [fakePixKey, setFakePixKey] = useState("");
  const [fakeCardLast4, setFakeCardLast4] = useState("");
  const [pending, setPending] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function reload() {
    const [available, history] = await Promise.all([planService.list(), transactionService.list({ page: 0, size: 20 })]);
    setPlans(available); setTransactions(history.content);
    try { setSubscription(await planService.getSubscription()); } catch { setSubscription(null); }
  }
  useEffect(() => { reload().catch((e) => setError(e instanceof Error ? e.message : "Não foi possível carregar os planos.")); }, []);
  const activePlans = useMemo(() => plans.filter((plan) => plan.active), [plans]);
  const selectedPlanDetails = plans.find((plan) => plan.planCode === selectedPlan);
  const isFreePlan = selectedPlanDetails?.price === 0;
  if (!user) return <Navigate to="/login" replace/>;

  async function checkout(event: FormEvent) {
    event.preventDefault(); if (!selectedPlan) return;
    setLoading(true); setError(""); setMessage("");
    const idempotencyKey = crypto.randomUUID();
    try {
      let transaction = await transactionService.checkout({ planCode: selectedPlan, paymentMethod: isFreePlan ? "PIX" : paymentMethod, ...(!isFreePlan && paymentMethod === "PIX" && fakePixKey ? { fakePixKey } : {}), ...(!isFreePlan && paymentMethod === "CREDIT_CARD" && fakeCardLast4 ? { fakeCardLast4 } : {}) }, idempotencyKey);
      setPending(transaction); setMessage(`Checkout iniciado: ${transaction.status}.`);
      for (let attempt = 0; attempt < 8 && (transaction.status === "PENDING" || transaction.status === "PROCESSING"); attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        transaction = await transactionService.get(transaction.id);
        setPending(transaction);
      }
      if (transaction.status === "APPROVED") setMessage("Pagamento aprovado e assinatura ativada.");
      else if (["REJECTED", "ERROR"].includes(transaction.status)) setError(transaction.errorMessage || "Pagamento não aprovado.");
      else setMessage("Transação continua pendente. Você pode acompanhar o estado abaixo.");
      await reload();
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível concluir o checkout."); }
    finally { setLoading(false); }
  }

  async function changeSubscription(action: "cancel" | "reactivate") {
    setLoading(true); setError(""); setMessage("");
    try { setSubscription(action === "cancel" ? await planService.cancelSubscription() : await planService.reactivateSubscription()); setMessage(action === "cancel" ? "Renovação cancelada." : "Assinatura reativada."); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível atualizar a assinatura."); }
    finally { setLoading(false); }
  }

  async function cancelPending() {
    if (!pending) return;
    setLoading(true); try { setPending(await transactionService.cancel(pending.id)); await reload(); }
    catch (e) { setError(e instanceof Error ? e.message : "Não foi possível cancelar a transação."); }
    finally { setLoading(false); }
  }

  return <WorkspaceLayout activeSection="plans" title="Planos e assinatura" subtitle="Escolha um plano e acompanhe suas transações.">
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Checkout demonstrativo:</strong> a API processa transações de teste e não cobra cartão nem gera PIX real. Para cobrança real será necessário configurar um adquirente e suas credenciais.</div>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{message}</p>}
    {subscription && <section className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm"><div><p className="text-xs font-semibold uppercase text-slate-400">Assinatura atual</p><h2 className="mt-1 text-xl font-bold">{subscription.plan.name}</h2><p className="text-sm text-slate-500">{subscription.status} · válida até {subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString("pt-BR") : "—"}</p></div><button disabled={loading} onClick={() => void changeSubscription(subscription.status === "CANCELED" ? "reactivate" : "cancel")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">{subscription.status === "CANCELED" ? "Reativar renovação" : "Cancelar renovação"}</button></section>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><section className="grid gap-4 md:grid-cols-2">{activePlans.map((plan) => <button key={plan.id} onClick={() => setSelectedPlan(plan.planCode)} className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition ${selectedPlan === plan.planCode ? "border-frigus-primary ring-2 ring-blue-100" : "border-slate-200 hover:border-blue-300"}`}><div className="flex items-start justify-between gap-2"><h2 className="text-lg font-bold">{plan.name}</h2><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-frigus-primary">{plan.planCode}</span></div><p className="mt-3 text-2xl font-bold">{plan.price === 0 ? "Grátis" : plan.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}<span className="text-sm font-normal text-slate-500">{plan.billingInterval === "YEARLY" ? "/ ano" : plan.billingInterval === "MONTHLY" ? "/ mês" : ""}</span></p><p className="mt-2 text-sm text-slate-500">{plan.description}</p><ul className="mt-4 space-y-1 text-xs text-slate-600"><li>{plan.limits.maxGroupsCreated < 0 ? "Grupos ilimitados" : `${plan.limits.maxGroupsCreated} grupos`}</li><li>{plan.limits.maxStocks < 0 ? "Estoques ilimitados" : `${plan.limits.maxStocks} estoques`}</li><li>{plan.limits.hasMonthlyReport ? "Relatório mensal incluído" : "Sem relatório mensal"}</li></ul></button>)}</section>
      <form onSubmit={checkout} className="h-fit rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Finalizar compra</h2>{isFreePlan?<p className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">Este plano não exige pagamento.</p>:<><label className="mt-4 block text-sm font-semibold">Forma de pagamento<select className="mt-1 w-full rounded-lg border border-slate-200 p-2.5" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}><option value="PIX">PIX demonstrativo</option><option value="CREDIT_CARD">Cartão demonstrativo</option><option value="BOLETO">Boleto demonstrativo</option></select></label>{paymentMethod === "PIX" && <label className="mt-3 block text-sm font-semibold">Chave PIX de teste<input required minLength={10} maxLength={150} value={fakePixKey} onChange={(e) => setFakePixKey(e.target.value)} placeholder="exemplo@teste.com" className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal"/></label>}{paymentMethod === "CREDIT_CARD" && <label className="mt-3 block text-sm font-semibold">Últimos 4 dígitos de teste<input required pattern="[0-9]{4}" maxLength={4} value={fakeCardLast4} onChange={(e) => setFakeCardLast4(e.target.value)} placeholder="4242" className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 font-normal"/></label>}</>}<button disabled={!selectedPlan || loading} className="mt-5 w-full rounded-lg bg-frigus-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{loading ? "Processando..." : "Confirmar checkout"}</button>{pending && ["PENDING", "PROCESSING"].includes(pending.status) && <button type="button" disabled={loading} onClick={() => void cancelPending()} className="mt-3 w-full text-sm font-semibold text-red-600">Cancelar transação pendente</button>}</form></div>
    <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">Histórico de transações</h2><div className="mt-4 divide-y divide-slate-100">{transactions.map((transaction) => <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><div><p className="font-semibold">{transaction.planCode} · {transaction.paymentMethod}</p><p className="text-xs text-slate-500">{new Date(transaction.createdAt).toLocaleString("pt-BR")}</p></div><div className="text-right"><p className="font-semibold">{transaction.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p><p className="text-xs text-slate-500">{transaction.status}</p></div></div>)}{!transactions.length && <p className="py-5 text-sm text-slate-500">Nenhuma transação encontrada.</p>}</div></section>
  </WorkspaceLayout>;
}
