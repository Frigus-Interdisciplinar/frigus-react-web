import { useEffect, useState } from "react";
import { ArrowRight, Eye, Megaphone, MousePointerClick, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { listMyAdvertisements, type Advertisement } from "@/services/advertisement.service";

export default function EnterpriseOverviewPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    listMyAdvertisements().then((page) => { if (active) setAds(page.content ?? []); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar os anúncios."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const activeCount = ads.filter((ad) => ad.status === "ACTIVE").length;
  const impressions = ads.reduce((total, ad) => total + ad.impressions, 0);
  const clicks = ads.reduce((total, ad) => total + ad.clicks, 0);
  const clickRate = impressions ? ((clicks / impressions) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0";

  return <EnterpriseLayout activeSection="overview" breadcrumb="Área empresarial    /    Visão geral">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Visão geral</h1><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Acompanhe os anúncios publicados pela sua empresa.</p></div><Link to="/enterprise/ads" className="inline-flex items-center gap-2 rounded-xl bg-[#2552C8] px-4 py-2.5 text-xs font-semibold text-white"><Plus size={16} />Criar anúncio</Link></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-3">
      {[{ label: "Anúncios ativos", value: activeCount.toLocaleString("pt-BR"), icon: Megaphone }, { label: "Impressões", value: impressions.toLocaleString("pt-BR"), icon: Eye }, { label: "Cliques", value: `${clicks.toLocaleString("pt-BR")} · ${clickRate}%`, icon: MousePointerClick }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-[#E1E7F0] bg-white p-5 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><div className="flex items-center justify-between text-xs font-semibold text-slate-500"><span>{label}</span><Icon size={17} className="text-[#2552C8]" /></div><p className="mt-3 text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : value}</p></div>)}
    </div>
    <section className="rounded-3xl border border-[#E1E7F0] bg-white p-5 shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-bold text-[#141C55] dark:text-white">Anúncios recentes</h2><p className="mt-1 text-xs text-slate-500">Resultados contabilizados pela API.</p></div><Link to="/enterprise/ads" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2552C8]">Ver anúncios <ArrowRight size={14} /></Link></div>
      {loading ? <p className="py-6 text-sm text-slate-500">Carregando anúncios…</p> : !ads.length ? <div className="py-8 text-center"><p className="text-sm font-semibold text-[#141C55] dark:text-white">Sua empresa ainda não tem anúncios</p><p className="mt-1 text-xs text-slate-500">Crie um anúncio e publique para exibi-lo no app.</p></div> : <div className="divide-y divide-slate-100 dark:divide-[#343941]">{ads.slice(0, 5).map((ad) => <div key={ad.id} className="flex items-center gap-3 py-3"><img src={ad.imageUrl} alt="" className="h-12 w-14 rounded-lg bg-slate-100 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="text-xs text-slate-500">{ad.productName} · {ad.status === "ACTIVE" ? "Ativo" : ad.status === "PAUSED" ? "Pausado" : ad.status === "DRAFT" ? "Rascunho" : "Arquivado"}</p></div><div className="text-right text-[11px] text-slate-500">{ad.impressions.toLocaleString("pt-BR")} impressões<br />{ad.clicks.toLocaleString("pt-BR")} cliques</div></div>)}</div>}
    </section>
  </EnterpriseLayout>;
}
