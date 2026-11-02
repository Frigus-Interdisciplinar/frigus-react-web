import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import { Download, Eye, MousePointerClick, Megaphone } from "lucide-react";
import { getMonthlyAdvertisementAnalytics, type MonthlyAdvertisementAnalytics } from "@/services/advertisement.service";

const thisMonth = new Date().toISOString().slice(0, 7);
const number = new Intl.NumberFormat("pt-BR");

export default function EnterpriseReportPage() {
  const [month, setMonth] = useState(thisMonth);
  const [report, setReport] = useState<MonthlyAdvertisementAnalytics | null>(null);
  const [result, setResult] = useState<{ month: string; error?: string }>({ month: "" });
  const loading = result.month !== month && !result.error;
  const error = result.month === month ? result.error ?? "" : "";

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void getMonthlyAdvertisementAnalytics(month, controller.signal)
      .then((data) => { if (active) { setReport(data); setResult({ month }); } })
      .catch((reason: unknown) => {
        if (active) setResult({ month, error: reason instanceof Error ? reason.message : "Não foi possível carregar o relatório." });
      })
      ;
    return () => { active = false; controller.abort(); };
  }, [month]);

  const campaigns = report?.campaigns ?? [];
  const exportCsv = () => {
    const rows = [
      ["Anúncio", "Produto", "Status", "Exibições acumuladas", "Cliques acumulados", "CTR (%)"],
      ...campaigns.map((ad) => [ad.name, ad.productName, ad.status, String(ad.cumulativeImpressions), String(ad.cumulativeClicks), String(ad.clickThroughRatePercent)]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `frigus-relatorio-anuncios-${month}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h1 className="font-montserrat text-2xl font-bold text-[#141C55] dark:text-white">Relatório mensal</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Campanhas com veiculação no mês e indicadores atuais.</p></div>
      <div className="flex items-center gap-3">
        <label htmlFor="enterprise-report-month" className="sr-only">Mês do relatório</label>
        <input id="enterprise-report-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-[#343941] dark:bg-[#1C1E22] dark:text-white" />
        <button type="button" disabled={loading || campaigns.length === 0} onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-[#2552C8] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Download size={15} /> Exportar CSV</button>
      </div>
    </div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">O mês seleciona campanhas cuja veiculação cruza o período. Exibições e cliques são os totais acumulados atuais dessas campanhas; a API ainda não fornece histórico mensal.</p>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Campanhas no período", value: number.format(report?.campaignCount ?? 0), icon: Megaphone },
        { label: "Exibições acumuladas", value: number.format(report?.cumulativeImpressions ?? 0), icon: Eye },
        { label: "Cliques acumulados", value: number.format(report?.cumulativeClicks ?? 0), icon: MousePointerClick },
      ].map(({ label, value, icon: Icon }) => <section key={label} className="rounded-2xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-neutral-400">{label}<Icon size={17} className="text-[#2552C8]" /></div><p className="mt-3 text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : value}</p></section>)}
    </div>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Campanhas incluídas</h2>{loading ? <LoadingSpinner label="Carregando relatório…" /> : campaigns.length === 0 ? <p className="py-6 text-sm text-[#64748B] dark:text-neutral-400">Nenhuma campanha coincidiu com este mês.</p> : <div className="mt-3 divide-y divide-slate-100 dark:divide-[#343941]">{campaigns.map((ad) => <article key={ad.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="text-xs text-[#64748B] dark:text-neutral-400">{ad.productName} · {ad.startDate ?? "sem data inicial"} – {ad.endDate ?? "sem data final"}</p></div><div className="text-right text-xs text-[#64748B] dark:text-neutral-400">{number.format(ad.cumulativeImpressions)} exibições · {number.format(ad.cumulativeClicks)} cliques · CTR {number.format(ad.clickThroughRatePercent)}%</div></article>)}</div>}</section>
  </div>;
}
