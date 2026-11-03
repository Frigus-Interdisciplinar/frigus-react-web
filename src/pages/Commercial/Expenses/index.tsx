import LoadingSpinner from "@/components/LoadingSpinner";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CommercialRegisterPurchaseModal } from "@/components/CommercialModals";

import type { Expense } from "@/types/commercial.type";
import { useServiceOperations } from "@/hooks/useServiceOperations";

export default function CommercialExpensesPage() {
  const apiOperations = useServiceOperations();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [groupId, setGroupId] = useState<string>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const beginRequest = useLatestRequest();
  const loadExpenses = useCallback(async () => {
    const signal = beginRequest();
    try {
      const id = await apiOperations.expenses.getCommercialGroupId(signal);
      const expenses = await apiOperations.expenses.listExpenses(id, signal);
      if (signal.aborted) return;
      setGroupId(id);
      setExpenses(expenses);
      setLoadError("");
    } catch {
      if (!signal.aborted) setLoadError("Não foi possível carregar as despesas comerciais.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [beginRequest, apiOperations.expenses]);

  useEffect(() => {    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadExpenses();
  }, [loadExpenses]);

  const createExpense = async (input: {
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
    supplier: string;
  }) => {
    if (!groupId) throw new Error("Grupo comercial indisponível");
    await apiOperations.expenses.createExpense(groupId, input);
    await loadExpenses();
    setFeedback("Despesa registrada com sucesso.");
  };

  const currentMonthExpenses = expenses.filter((expense) =>
    expense.expenseDate.startsWith(new Date().toISOString().slice(0, 7)),
  );
  const monthTotal = currentMonthExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );
  const recentOrders = expenses.slice(0, 8).map((expense) => ({
    id: `#${expense.id.slice(0, 8)}`,
    key: expense.id,
    supplier: expense.supplier || expense.description,
    value: Number(expense.amount).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    }),
    status: "Registrada",
    statusColor:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
  }));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Gastos e compras
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Acompanhe o orçamento, os pedidos e os próximos pagamentos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPurchaseModalOpen(true)}
          aria-expanded={isPurchaseModalOpen}
          aria-haspopup="dialog"
          aria-controls="commercial-modal-dialog"
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Registrar compra</span>
        </button>
      </div>
      {loadError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {loadError}{" "}
          <button
            type="button"
            onClick={() => void loadExpenses()}
            className="underline"
          >
            Tentar novamente
          </button>
        </p>
      )}
      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {feedback}
        </p>
      )}
      {loading && (
        <LoadingSpinner label="Carregando despesas…" />
      )}

      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 tracking-wider uppercase">
              TOTAL REGISTRADO /{" "}
              {new Date()
                .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                .toUpperCase()}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white">
                {monthTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="text-xs text-[#64748B] dark:text-neutral-400">
                em {currentMonthExpenses.length} lançamentos
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {expenses.length} lançamentos no total
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-[#252A32] overflow-hidden">
          <div className="h-full bg-linear-to-r from-[#2552C8] to-[#467bf7] rounded-full w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Compras ao longo do mês
              </h2>
              <p className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 tracking-wider uppercase mt-0.5">
                VALOR EM REAIS
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-gray-50 dark:bg-[#252A32] p-6 text-sm text-gray-600 dark:text-gray-300">
            {currentMonthExpenses.length
              ? `${currentMonthExpenses.length} despesas registradas neste mês. Consulte a lista para ver cada lançamento.`
              : "Ainda não há despesas registradas neste mês."}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Próximos pagamentos
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Vencem nos próximos 7 dias
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A API de despesas não controla vencimentos ou pagamentos futuros.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-[#343941] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Despesas do mês
            </span>
            <span className="text-sm font-bold text-[#141C55] dark:text-white">
              {monthTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <div className="lg:col-span-12 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Pedidos recentes
              </h2>
              <p className="text-xs text-[#64748B] dark:text-neutral-400">
                Últimas compras registradas para a operação
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-300">
              {expenses.length} lançamentos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Pedido / Fornecedor</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {!loading && !loadError && recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-5 text-sm text-gray-500">
                      Nenhuma despesa cadastrada.
                    </td>
                  </tr>
                )}
                {recentOrders.map((order) => (
                  <tr
                    key={order.key}
                    className="hover:bg-gray-50/70 dark:hover:bg-[#252A32]/50 transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#141C55] dark:text-white">
                        {order.id}
                      </span>
                      <span className="text-[#64748B] dark:text-neutral-400 ml-2">
                        · {order.supplier}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#141C55] dark:text-white">
                      {order.value}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CommercialRegisterPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onCreate={createExpense}
      />
    </>
  );
}
