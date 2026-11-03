import { ExternalLink } from "lucide-react";
import type { AdvertisementShelfProps } from "@/types/advertisement-component-props.type";
import type { Advertisement } from "@/types/advertisement.type";
import { safeHttpUrl } from "@/utils/url.util";
import { Skeleton, SkeletonCard } from "@/components/LoadingSkeleton";

export type { AdvertisementShelfProps } from "@/types/advertisement-component-props.type";

export default function AdvertisementShelf({
  advertisements,
  loading,
  error,
  onOfferClick,
}: AdvertisementShelfProps) {
  return (
    <section aria-label="Anúncios ativos" className="space-y-3">
      <div>
        <h2 className="font-montserrat text-lg font-bold text-frigus-navy dark:text-white">
          Anúncios
        </h2>
        <p className="text-xs text-gray-500 dark:text-neutral-400">
          Ofertas ativas de anunciantes
        </p>
      </div>
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <SkeletonCard
              key={item}
              className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-[#343941] dark:bg-[#1C1E22]"
            >
              <Skeleton width="100%" height={160} />
              <div className="space-y-3 p-4">
                <Skeleton width="42%" height={11} />
                <Skeleton width="70%" height={18} />
                <Skeleton width="100%" height={12} />
                <Skeleton width="86%" height={12} />
              </div>
            </SkeletonCard>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {!loading && !error && !advertisements.length && (
        <p role="status" className="text-sm text-slate-500">
          Nenhum anúncio ativo no momento.
        </p>
      )}
      {!!advertisements.length && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {advertisements.map((ad: Advertisement) => {
            const imageUrl = safeHttpUrl(ad.imageUrl);
            const destinationUrl = safeHttpUrl(ad.destinationUrl);
            return (
              <article
                key={ad.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs dark:border-[#343941] dark:bg-[#1C1E22]"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full bg-slate-100 object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-40 bg-slate-100 dark:bg-[#252A32]"
                  />
                )}
                <div className="space-y-2 p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Anúncio · {ad.category}
                  </span>
                  <h3 className="font-bold text-frigus-navy dark:text-white">
                    {ad.productName}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500 dark:text-neutral-400">
                    {ad.description}
                  </p>
                  {ad.price != null && (
                    <p className="text-sm font-bold text-frigus-navy dark:text-white">
                      {ad.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                  {destinationUrl && (
                    <a
                      href={destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onOfferClick?.(ad.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-frigus-primary hover:underline"
                    >
                      Ver oferta <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
