import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { listActiveAdvertisements, recordAdvertisementClick, recordAdvertisementImpression, type Advertisement } from "@/services/advertisement.service";

export default function AdvertisementShelf() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  useEffect(() => {
    let active = true;
    listActiveAdvertisements().then((page) => {
      if (!active) return;
      const visibleAds = (page.content ?? []).slice(0, 3);
      setAds(visibleAds);
      visibleAds.forEach((ad) => { void recordAdvertisementImpression(ad.id).catch(() => undefined); });
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  if (!ads.length) return null;
  return (
    <section aria-label="Anúncios ativos" className="space-y-3">
      <div><h2 className="font-montserrat text-lg font-bold text-frigus-navy dark:text-white">Anúncios</h2><p className="text-xs text-gray-500 dark:text-neutral-400">Ofertas ativas de anunciantes</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ads.map((ad) => <article key={ad.id} className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"><img src={ad.imageUrl} alt="" loading="lazy" className="h-40 w-full bg-slate-100 object-cover" /><div className="space-y-2 p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Anúncio · {ad.category}</span><h3 className="font-bold text-frigus-navy dark:text-white">{ad.productName}</h3><p className="line-clamp-2 text-xs text-slate-500 dark:text-neutral-400">{ad.description}</p>{ad.price != null && <p className="text-sm font-bold text-frigus-navy dark:text-white">{ad.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>}{ad.destinationUrl && <a href={ad.destinationUrl} target="_blank" rel="noreferrer" onClick={() => { void recordAdvertisementClick(ad.id).catch(() => undefined); }} className="inline-flex items-center gap-1 text-xs font-semibold text-frigus-primary hover:underline">Ver oferta <ExternalLink size={13} /></a>}</div></article>)}
      </div>
    </section>
  );
}
