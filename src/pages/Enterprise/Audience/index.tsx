import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useMemo, useState } from "react";
import { Eye, MousePointerClick, UsersRound } from "lucide-react";
import { listMyAdvertisements, type Advertisement } from "@/services/advertisement.service";

const number = new Intl.NumberFormat("pt-BR");

export default function EnterpriseAudiencePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void listMyAdvertisements(controller.signal)
      .then((page) => { if (active) setAds(page.content); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar os dados de público.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, []);

  const impressions = ads.reduce((total, ad) => total + ad.impressions, 0);
  const clicks = ads.reduce((total, ad) => total + ad.clicks, 0);
  const categories = useMemo(() => {
    const totals = new Map<string, number>();
    for (const ad of ads) totals.set(ad.category || "Sem categoria", (totals.get(ad.category || "Sem categoria") ?? 0) + ad.impressions);
    return [...totals].sort((a, b) => b[1] - a[1]);
  }, [ads]);
  const maxCategoryImpressions = Math.max(1, ...categories.map(([, count]) => count));

  return <div className="space-y-6">
    <div><h1 className="font-montserrat text-2xl font-bold text-[#141C55] dark:text-white">Público atingido</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Exposição e interação acumuladas dos anúncios da sua empresa.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200">A API contabiliza impressões e cliques. Impressões representam exibições e não identificam usuários únicos.</p>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { label: "Exibições acumuladas", value: impressions, icon: Eye },
        { label: "Interações acumuladas", value: clicks, icon: MousePointerClick },
        { label: "Anúncios contabilizados", value: ads.length, icon: UsersRound },
      ].map(({ label, value, icon: Icon }) => <section key={label} className="rounded-2xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between text-xs font-semibold text-[#64748B] dark:text-neutral-400">{label}<Icon size={17} className="text-[#2552C8]" /></div><p className="mt-3 text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : number.format(value)}</p></section>)}
    </div>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Exibições por categoria</h2>{loading ? <LoadingSpinner label="Carregando público…" /> : categories.length === 0 ? <p className="py-6 text-sm text-[#64748B] dark:text-neutral-400">Ainda não há anúncios para contabilizar.</p> : <div className="mt-5 space-y-5">{categories.map(([category, count]) => <div key={category}><div className="mb-2 flex justify-between gap-3 text-xs"><span className="font-medium text-[#141C55] dark:text-white">{category}</span><span className="text-[#64748B] dark:text-neutral-400">{number.format(count)}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#343941]"><div className="h-full rounded-full bg-[#2552C8]" style={{ width: `${(count / maxCategoryImpressions) * 100}%` }} /></div></div>)}</div>}</section>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Anúncios e interação</h2>{loading ? <LoadingSpinner label="Carregando anúncios…" /> : ads.length === 0 ? <p className="py-6 text-sm text-[#64748B] dark:text-neutral-400">Ainda não há dados disponíveis.</p> : <div className="mt-3 divide-y divide-slate-100 dark:divide-[#343941]">{ads.map((ad) => <article key={ad.id} className="flex flex-wrap items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="text-xs text-[#64748B] dark:text-neutral-400">{ad.productName} · {ad.category}</p></div><div className="text-right text-xs text-[#64748B] dark:text-neutral-400">{number.format(ad.impressions)} exibições · {number.format(ad.clicks)} interações</div></article>)}</div>}</section>
  </div>;
}
