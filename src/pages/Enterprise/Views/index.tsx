import { useEffect, useState } from "react";
import { Eye, MousePointerClick } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { listMyAdvertisements, type Advertisement } from "@/services/advertisement.service";

export default function EnterpriseViewsPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    listMyAdvertisements().then((page) => { if (active) setAds(page.content ?? []); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar as métricas."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const impressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const clicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const rate = impressions ? ((clicks / impressions) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0";
  return <EnterpriseLayout activeSection="views" breadcrumb="Área empresarial    /    Visualizações">
    <div><h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Visualizações e cliques</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Contagens acumuladas dos anúncios da sua empresa.</p></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-3">{[{ label: "Impressões acumuladas", value: impressions, icon: Eye }, { label: "Cliques acumulados", value: clicks, icon: MousePointerClick }, { label: "Cliques por impressão", value: `${rate}%`, icon: MousePointerClick }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>{label}</span><Icon size={17} className="text-[#2552C8]" /></div><p className="mt-3 text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : typeof value === "number" ? value.toLocaleString("pt-BR") : value}</p></div>)}</div>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 dark:border-[#343941] dark:bg-[#1C1E22]"><h2 className="font-bold text-[#141C55] dark:text-white">Métricas por anúncio</h2><p className="mt-1 text-xs text-slate-500">A API contabiliza os eventos depois que o anúncio aparece no app.</p>{loading ? <p className="py-6 text-sm text-slate-500">Carregando…</p> : !ads.length ? <p className="py-6 text-sm text-slate-500">Ainda não há anúncios cadastrados.</p> : <div className="mt-4 divide-y divide-slate-100 dark:divide-[#343941]">{ads.map((ad) => <div key={ad.id} className="flex items-center gap-3 py-3"><img src={ad.imageUrl} alt="" className="h-12 w-14 rounded-lg bg-slate-100 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="text-xs text-slate-500">{ad.productName}</p></div><div className="text-right text-xs text-slate-500">{ad.impressions.toLocaleString("pt-BR")} impressões · {ad.clicks.toLocaleString("pt-BR")} cliques</div></div>)}</div>}</section>
  </EnterpriseLayout>;
}
