import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import { Eye, MousePointerClick, Megaphone } from "lucide-react";
import { getAdvertisementAudienceAnalytics, type AdvertisementAudienceAnalytics } from "@/services/advertisement.service";

const number = new Intl.NumberFormat("pt-BR");

export default function EnterpriseAudiencePage() {
  const [analytics, setAnalytics] = useState<AdvertisementAudienceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void getAdvertisementAudienceAnalytics(controller.signal)
      .then((data) => { if (active) setAnalytics(data); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar os dados de público.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, []);

  const categories = analytics?.categories ?? [];
  const campaigns = analytics?.campaigns ?? [];
  const maxCategoryImpressions = Math.max(1, ...categories.map((category) => category.cumulativeImpressions));

  return <div className="space-y-6">
    <div><h1 className="font-montserrat text-2xl font-bold text-[#141C55] dark:text-white">Público atingido</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Exposição e interação acumuladas dos anúncios da sua empresa.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">A API registra exibições e cliques, mas não identifica pessoas únicas. Os indicadores abaixo mostram volume de exposição, interação e participação por categoria.</p>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Exibições acumuladas", value: number.format(analytics?.cumulativeImpressions ?? 0), icon: Eye },
        { label: "Cliques acumulados", value: number.format(analytics?.cumulativeClicks ?? 0), icon: MousePointerClick },
        { label: "Campanhas ativas", value: number.format(analytics?.activeCampaignCount ?? 0), icon: Megaphone },
      ].map(({ label, value, icon: Icon }) => <section key={label} className="rounded-2xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-neutral-400">{label}<Icon size={17} className="text-[#2552C8]" /></div><p className="mt-3 text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : value}</p></section>)}
    </div>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Participação das exibições por categoria</h2>{loading ? <LoadingSpinner label="Carregando público…" /> : categories.length === 0 ? <p className="py-6 text-sm text-[#64748B] dark:text-neutral-400">Ainda não há anúncios para contabilizar.</p> : <div className="mt-5 space-y-5">{categories.map((category) => <div key={category.category}><div className="mb-2 flex justify-between gap-3 text-xs"><span className="font-medium text-[#141C55] dark:text-white">{category.category}</span><span className="text-[#64748B] dark:text-neutral-400">{number.format(category.cumulativeImpressions)} · {number.format(category.impressionSharePercent)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#343941]"><div className="h-full rounded-full bg-[#2552C8]" style={{ width: `${(category.cumulativeImpressions / maxCategoryImpressions) * 100}%` }} /></div></div>)}</div>}</section>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Exibições e cliques por campanha</h2>{loading ? <LoadingSpinner label="Carregando campanhas…" /> : campaigns.length === 0 ? <p className="py-6 text-sm text-[#64748B] dark:text-neutral-400">Ainda não há dados disponíveis.</p> : <div className="mt-3 divide-y divide-slate-100 dark:divide-[#343941]">{campaigns.map((ad) => <article key={ad.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="text-xs text-[#64748B] dark:text-neutral-400">{ad.productName} · {ad.category}</p></div><div className="text-right text-xs text-[#64748B] dark:text-neutral-400">{number.format(ad.cumulativeImpressions)} exibições · {number.format(ad.cumulativeClicks)} cliques</div></article>)}</div>}</section>
  </div>;
}
