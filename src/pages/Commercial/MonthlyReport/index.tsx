import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { api } from "@/utils/api.util";

type MonthlyReport = { month: string; totalExpenses: number; purchaseTotal: number; completedPurchases: number; expensesByCategory: Record<string, number> };
const thisMonth = new Date().toISOString().slice(0, 7);
const money = (value: number) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CommercialMonthlyReportPage() {
  const [month, setMonth] = useState(thisMonth);
  const [report, setReport] = useState<MonthlyReport>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    void api.get<{ groupId: string }>("/web/core/inventory/active-context")
      .then((context) => api.get<MonthlyReport>(`/web/core/commercial/groups/${context.groupId}/reports/monthly?month=${month}`))
      .then((data) => { if (active) setReport(data); })
      .catch(() => active && setError("Não foi possível carregar o relatório para este mês."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [month]);

  const exportCsv = () => {
    if (!report) return;
    const rows = [["Categoria", "Valor"], ...Object.entries(report.expensesByCategory).map(([category, amount]) => [category, String(amount)]), ["Total", String(report.totalExpenses)]];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    link.download = `frigus-relatorio-${month}.csv`;
    link.click(); URL.revokeObjectURL(link.href);
  };

  const categories = Object.entries(report?.expensesByCategory ?? {});
  const total = Number(report?.totalExpenses ?? 0);

  return (
    <CommercialLayout activeSection="monthly-report" breadcrumb="Área comercial    /    Relatório mensal">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Relatório mensal</h1><p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">Resumo dos lançamentos comerciais salvos no sistema.</p></div>
          <div className="flex items-center gap-3"><input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#343941] dark:bg-[#1C1E22] dark:text-white" /><button type="button" disabled={!report || loading} onClick={exportCsv} className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"><Download size={16} /> Exportar CSV</button></div>
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <section className="bg-linear-to-br from-[#131C55] via-[#1E2C7A] to-[#2552C8] rounded-3xl p-6 text-white shadow-md">
          <span className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">FECHAMENTO / {month}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div><p className="text-3xl font-bold">{money(total)}</p><p className="text-xs text-blue-100 mt-1">Despesas registradas</p></div>
            <div><p className="text-3xl font-bold">{money(Number(report?.purchaseTotal ?? 0))}</p><p className="text-xs text-blue-100 mt-1">Compras concluídas</p></div>
            <div><p className="text-3xl font-bold">{report?.completedPurchases ?? 0}</p><p className="text-xs text-blue-100 mt-1">Listas de compras concluídas</p></div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6">
          <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">Despesas por categoria</h2>
          {loading ? <p className="py-6 text-sm text-gray-500">Carregando relatório…</p> : categories.length === 0 ? <p className="py-6 text-sm text-gray-500">Nenhuma despesa cadastrada neste mês.</p> : <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{categories.map(([category, amount]) => <div key={category} className="p-4 rounded-2xl bg-gray-50 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]"><span className="text-xs text-[#64748B] dark:text-neutral-400">{category}</span><p className="mt-1 text-xl font-bold text-[#141C55] dark:text-white">{money(Number(amount))}</p><div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-neutral-700"><div className="h-full rounded-full bg-[#2552C8]" style={{ width: `${total ? (Number(amount) / total) * 100 : 0}%` }} /></div></div>)}</div>}
        </section>
      </div>
    </CommercialLayout>
  );
}
