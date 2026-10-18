import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Megaphone, MousePointerClick, Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { listMyAdvertisements, type Advertisement } from "@/services/advertisement.service";

const numberFormat = new Intl.NumberFormat("pt-BR");

function statusLabel(status: Advertisement["status"]) {
  return ({ ACTIVE: "Ativo", PAUSED: "Pausado", DRAFT: "Rascunho", ARCHIVED: "Arquivado" })[status];
}

export default function EnterpriseOverviewPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listMyAdvertisements()
      .then((page) => { if (active) setAds(page.content ?? []); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar os anúncios."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const activeAds = ads.filter((ad) => ad.status === "ACTIVE").length;
    const impressions = ads.reduce((total, ad) => total + ad.impressions, 0);
    const clicks = ads.reduce((total, ad) => total + ad.clicks, 0);
    return { activeAds, impressions, clicks, drafts: ads.filter((ad) => ad.status === "DRAFT").length };
  }, [ads]);
  const expiringAds = ads.filter((ad) => ad.status === "ACTIVE" && ad.endDate && new Date(`${ad.endDate}T23:59:59`) >= new Date() && new Date(`${ad.endDate}T23:59:59`) <= new Date(Date.now() + 30 * 86400000)).length;

  const cards = [
    { label: "Anúncios ativos", value: numberFormat.format(stats.activeAds), icon: Megaphone },
    { label: "Impressões", value: numberFormat.format(stats.impressions), icon: Eye },
    { label: "Cliques", value: numberFormat.format(stats.clicks), icon: MousePointerClick },
    { label: "Pedidos atribuídos", value: "—", note: "Rastreamento indisponível", icon: ShoppingBag },
  ];

  return (
    <EnterpriseLayout activeSection="overview" breadcrumb="Área empresarial    /    Visão geral">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-[#141C55] dark:text-white">Visão geral</h1>
          <p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Acompanhe o desempenho e a operação dos anúncios da sua empresa.</p>
        </div>
        <Link to="/enterprise/ads" className="inline-flex h-10 items-center gap-2 rounded-md bg-[#2552C8] px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700">
          <Plus size={16} /> Criar anúncio
        </Link>
      </div>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon }) => (
          <section key={label} className="min-h-[118px] rounded-xl border border-[#E1E7F0] bg-white p-5 dark:border-[#34383E] dark:bg-[#1B1D20]">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748B] dark:text-neutral-400"><span>{label}</span><Icon size={17} className="text-[#2552C8] dark:text-[#A7BCFF]" /></div>
            <p className="mt-3 font-montserrat text-2xl font-bold text-[#141C55] dark:text-white">{loading ? "—" : value}</p>
            {note && <p className="mt-1 text-[10px] text-[#64748B] dark:text-neutral-500">{note}</p>}
          </section>
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <section className="overflow-hidden rounded-xl border border-[#E1E7F0] bg-white dark:border-[#34383E] dark:bg-[#1B1D20]">
          <div className="flex items-center justify-between border-b border-[#E8ECF2] px-5 py-4 dark:border-[#34383E]">
            <div><h2 className="text-sm font-bold text-[#141C55] dark:text-white">Anúncios em destaque</h2><p className="mt-1 text-[11px] text-[#64748B] dark:text-neutral-400">Desempenho dos anúncios da sua empresa</p></div>
            <Link to="/enterprise/ads" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2552C8] dark:text-[#A7BCFF]">Ver todos <ArrowRight size={14} /></Link>
          </div>
          {loading ? <p className="px-5 py-8 text-sm text-[#64748B]">Carregando anúncios…</p> : ads.length === 0 ? (
            <div className="px-5 py-10 text-center"><p className="text-sm font-semibold text-[#141C55] dark:text-white">Sua empresa ainda não tem anúncios</p><p className="mt-1 text-xs text-[#64748B] dark:text-neutral-400">Crie um anúncio para começar a acompanhar os resultados.</p></div>
          ) : <div className="divide-y divide-[#E8ECF2] dark:divide-[#34383E]">
            {ads.slice(0, 4).map((ad) => <article key={ad.id} className="flex items-center gap-3 px-5 py-3.5">
              {ad.imageUrl ? <img src={ad.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-md bg-[#F1F4F8] object-cover dark:bg-[#25282C]" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#F1F4F8] text-[#64748B] dark:bg-[#25282C]"><Megaphone size={18} /></div>}
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#141C55] dark:text-white">{ad.name}</p><p className="mt-1 truncate text-[10px] text-[#64748B] dark:text-neutral-400">{ad.category} · {statusLabel(ad.status)}</p></div>
              <div className="hidden min-w-[76px] text-right sm:block"><p className="text-xs font-semibold text-[#141C55] dark:text-white">{numberFormat.format(ad.impressions)}</p><p className="text-[10px] text-[#64748B] dark:text-neutral-400">impressões</p></div>
              <div className="hidden min-w-[58px] text-right md:block"><p className="text-xs font-semibold text-[#141C55] dark:text-white">{numberFormat.format(ad.clicks)}</p><p className="text-[10px] text-[#64748B] dark:text-neutral-400">cliques</p></div>
            </article>)}
          </div>}
        </section>

        <section className="rounded-xl border border-[#E1E7F0] bg-white p-5 dark:border-[#34383E] dark:bg-[#1B1D20]">
          <div className="mb-4"><h2 className="text-sm font-bold text-[#141C55] dark:text-white">Operação dos anúncios</h2><p className="mt-1 text-[11px] text-[#64748B] dark:text-neutral-400">Itens que podem precisar da sua atenção</p></div>
          <div className="divide-y divide-[#E8ECF2] dark:divide-[#34383E]">
            <div className="flex items-center justify-between py-3"><span className="text-xs text-[#536782] dark:text-neutral-300">Em análise</span><span className="text-sm font-bold text-[#141C55] dark:text-white">—</span></div>
            <div className="flex items-center justify-between py-3"><span className="text-xs text-[#536782] dark:text-neutral-300">Rascunhos</span><span className="text-sm font-bold text-[#141C55] dark:text-white">{loading ? "—" : stats.drafts}</span></div>
            <div className="flex items-center justify-between py-3"><span className="text-xs text-[#536782] dark:text-neutral-300">Encerram nos próximos 30 dias</span><span className="text-sm font-bold text-[#141C55] dark:text-white">{loading ? "—" : expiringAds}</span></div>
          </div>
          <Link to="/enterprise/ads" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2552C8] dark:text-[#A7BCFF]">Gerenciar anúncios <ArrowRight size={14} /></Link>
        </section>
      </div>
    </EnterpriseLayout>
  );
}
