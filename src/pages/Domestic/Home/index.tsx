import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import Badge from "@/components/Badge";
import {
  getInventoryContext,
  getInventorySummary,
  listStockProducts,
  type StockProduct,
  type StockSummary,
} from "@/services/inventory.service";
import { useStore } from "@/store/store";
import {
  getShoppingListPreview,
  type ShoppingListPreviewItem,
} from "@/services/shopping-list.service";
import { Skeleton } from "@/components/LoadingSkeleton";
import {
  formatProductCategory,
  formatUnitOfMeasure,
} from "@/utils/unit.util";

export default function DashboardPage() {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [shoppingItems, setShoppingItems] = useState<ShoppingListPreviewItem[]>(
    [],
  );
  const [shoppingLoading, setShoppingLoading] = useState(true);
  const [shoppingError, setShoppingError] = useState("");
  const [recentProducts, setRecentProducts] = useState<StockProduct[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");
  const user = useStore((state) => state.user);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    void getInventorySummary(signal)
      .then((summary) => {
        if (!signal.aborted) setSummary(summary);
      })
      .catch(() => {
        if (!signal.aborted)
          setSummaryError("Não foi possível carregar o resumo.");
      })
      .finally(() => {
        if (!signal.aborted) setSummaryLoading(false);
      });
    void getShoppingListPreview(signal)
      .then((items) => {
        if (!signal.aborted) setShoppingItems(items);
      })
      .catch(() => {
        if (!signal.aborted)
          setShoppingError("Não foi possível carregar a lista de compras.");
      })
      .finally(() => {
        if (!signal.aborted) setShoppingLoading(false);
      });
    void getInventoryContext(signal)
      .then(async (context) => {
        const stock = context.stocks[0];
        if (!stock || signal.aborted) return;
        const products = await listStockProducts(stock.id, signal);
        if (!signal.aborted) setRecentProducts(products.slice(0, 4));
      })
      .catch(() => {
        if (!signal.aborted)
          setRecentError("Não foi possível carregar os produtos recentes.");
      })
      .finally(() => {
        if (!signal.aborted) setRecentLoading(false);
      });
    return () => controller.abort();
  }, []);
  const nearExpiration = summary?.nearExpiration ?? [];
  const readyPercentage = summary?.itemCount
    ? Math.round(
        ((summary.itemCount - nearExpiration.length) / summary.itemCount) * 100,
      )
    : 0;
  const consumedCount = Object.values(summary?.consumedThisWeek ?? {}).reduce(
    (total, count) => total + count,
    0,
  );
  const consumptionDays = Object.entries(summary?.consumedThisWeek ?? {}).slice(
    -7,
  );
  const maxDailyConsumption = Math.max(
    1,
    ...consumptionDays.map(([, count]) => count),
  );
  const firstName = user?.name.trim().split(/\s+/)[0] || "visitante";
  return (
    <>
      <div className="space-y-6">
        {summaryError && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {summaryError}
          </p>
        )}
        {shoppingError && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {shoppingError}
          </p>
        )}
        {recentError && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {recentError}
          </p>
        )}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
            Bom dia, {firstName}
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
            Uma visão clara para aproveitar melhor cada item
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 min-h-[148px] bg-white dark:bg-[#1B1D20] border border-[#D5E1F2] dark:border-[#34383E] rounded-xl p-6 md:p-7 text-[#141C55] dark:text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="absolute right-0 top-0 w-[120px] h-[122px] rounded-full bg-[#2552C8]/35 pointer-events-none translate-x-1/4 -translate-y-1/4" />
            <div className="absolute right-0 bottom-0 w-[120px] h-[122px] rounded-full bg-[#F9C968]/45 pointer-events-none translate-x-1/3 translate-y-1/4" />

            <div className="relative z-10 space-y-3 max-w-md">
              <h2 className="font-montserrat font-bold text-lg leading-tight text-[#141C55] dark:text-white">
                {summaryLoading ? (
                  <Skeleton width={190} height={22} />
                ) : (
                  <>
                    {nearExpiration.length}{" "}
                    {nearExpiration.length === 1 ? "item pede" : "itens pedem"}{" "}
                    atenção
                  </>
                )}
              </h2>
              <p className="text-[#536782] dark:text-neutral-300 text-xs font-sans leading-relaxed">
                Você ainda consegue usá-los antes da validade.
              </p>
              <div className="pt-2">
                <Link
                  to="/alerts"
                  className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors"
                >
                  <span>Ver itens</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-full md:w-[206px] min-h-[102px] bg-[#141C55] dark:bg-[#15191F] rounded-md p-3.5 border border-white/10 flex flex-row items-center justify-between shrink-0 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-frigus-ice">
                  Estoque em dia
                </span>
                <div className="font-montserrat font-bold text-3xl text-white mt-1">
                  {summaryLoading ? (
                    <Skeleton width={64} height={32} />
                  ) : (
                    `${readyPercentage}%`
                  )}
                </div>
                <span className="text-xs text-frigus-ice/80">
                  dos itens sem alerta
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-10 mt-4 pt-1">
                <div className="w-2.5 h-4 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-5 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-10 bg-frigus-accent rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Para usar primeiro
              </h3>
              <Link
                to="/alerts"
                className="text-[11px] font-semibold text-[#2552C8] dark:text-[#A7BCFF] hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#343941] my-4" />

            <div className="space-y-2.5">
              {summaryLoading && (
                <div
                  role="status"
                  aria-label="Carregando validade dos produtos"
                  className="space-y-3 py-1"
                >
                  {[0, 1].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Skeleton width={4} height={28} />
                      <div className="flex-1 space-y-2">
                        <Skeleton width="55%" height={12} />
                        <Skeleton width="80%" height={10} />
                      </div>
                      <Skeleton width={58} height={20} />
                    </div>
                  ))}
                </div>
              )}
              {!summaryLoading &&
                nearExpiration.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1 h-7 rounded-full ${item.productStatus === "EXPIRED" ? "bg-red-500" : "bg-amber-400"}`}
                      />
                      <div>
                        <h4 className="text-[11px] font-semibold text-frigus-navy dark:text-white group-hover:text-frigus-primary dark:group-hover:text-[#5B89F7] transition-colors">
                          {item.product?.name ?? `Produto ${item.productId}`}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-neutral-400">
                          {item.quantity} un. · validade{" "}
                          {new Date(
                            `${item.expireDate}T12:00:00`,
                          ).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        item.productStatus === "EXPIRED" ? "danger" : "warning"
                      }
                    >
                      {item.productStatus === "EXPIRED"
                        ? "Vencido"
                        : "Em breve"}
                    </Badge>
                  </div>
                ))}
              {!summaryLoading && nearExpiration.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  {summaryError || "Nenhum produto próximo da validade."}
                </p>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#343941] flex items-center justify-between text-[10px] text-gray-400 dark:text-neutral-400">
              <span>Evite desperdícios na despensa</span>
              <ArrowRight
                size={14}
                className="text-gray-400 dark:text-neutral-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                  Consumo da semana
                </h3>
                <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
                  Itens retirados do estoque
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#EAF3FF] dark:bg-blue-950/50 text-frigus-primary dark:text-[#A7BCFF]">
                {consumedCount} itens usados
              </span>
            </div>

            <div className="mt-6">
              <div className="relative h-32 flex items-end justify-between px-4 pb-6 border-b border-gray-100 dark:border-[#343941]">
                <div className="absolute inset-x-0 top-2 border-t border-dashed border-gray-100 dark:border-[#343941]" />
                <div className="absolute inset-x-0 top-14 border-t border-dashed border-gray-100 dark:border-[#343941]" />

                {consumptionDays.length ? (
                  consumptionDays.map(([day, count], idx) => (
                    <div
                      key={day}
                      className="flex flex-col items-center gap-2 relative z-10 w-7"
                    >
                      <div
                        title={`${count} itens`}
                        className={`w-full ${idx === consumptionDays.length - 1 ? "bg-frigus-ice dark:bg-[#92ACF7]" : "bg-frigus-primary dark:bg-[#5B89F7]"} rounded-lg transition-all duration-300 hover:brightness-110`}
                        style={{
                          height: `${Math.max(8, (count / maxDailyConsumption) * 100)}%`,
                        }}
                      />
                      <span className="text-[11px] font-medium text-gray-400 dark:text-neutral-400">
                        {day.match(/^\d{4}-\d{2}-\d{2}/)
                          ? new Date(`${day}T12:00:00`)
                              .toLocaleDateString("pt-BR", { weekday: "short" })
                              .slice(0, 1)
                              .toUpperCase()
                          : day.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 dark:text-neutral-400">
                    Sem consumo registrado nesta semana
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white dark:bg-[#1B1D20] border border-gray-200/80 dark:border-[#34383E] text-[#141C55] dark:text-white rounded-xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-[#141C55] dark:text-white text-sm mt-0.5">
                Seu estoque
              </h3>
            </div>

            <div className="my-4 flex items-center justify-center">
              <div className="relative w-24 h-24 rounded-full border-[7px] border-[#DDE6F5] dark:border-[#2C303B] flex items-center justify-center border-t-frigus-primary border-r-frigus-accent border-l-[#6D91EA]">
                <div className="text-center">
                  <span className="font-montserrat font-bold text-xl text-[#141C55] dark:text-white block leading-none">
                    {summaryLoading ? (
                      <Skeleton width={34} height={24} />
                    ) : (
                      (summary?.itemCount ?? 0)
                    )}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-neutral-400 uppercase tracking-wider font-semibold">
                    itens
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex items-center justify-between text-[#64748B] dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-ice dark:bg-neutral-400" />
                  Despensa
                </span>
                <span className="font-semibold text-[#141C55] dark:text-white">
                  {summaryLoading ? (
                    <Skeleton width={18} />
                  ) : (
                    (summary?.itemsByStoragePlace?.PANTRY ?? 0)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-primary" />
                  Geladeira
                </span>
                <span className="font-semibold text-[#141C55] dark:text-white">
                  {summaryLoading ? (
                    <Skeleton width={18} />
                  ) : (
                    (summary?.itemsByStoragePlace?.FRIDGE ?? 0)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-accent" />
                  Frescos
                </span>
                <span className="font-semibold text-[#141C55] dark:text-white">
                  {summaryLoading ? (
                    <Skeleton width={18} />
                  ) : (
                    (summary?.itemsByStoragePlace?.PANTRY ?? 0) +
                    (summary?.itemsByStoragePlace?.SHELF ?? 0)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#64748B] dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D91EA]" />
                  Congelados
                </span>
                <span className="font-semibold text-[#141C55] dark:text-white">
                  {summaryLoading ? (
                    <Skeleton width={18} />
                  ) : (
                    (summary?.itemsByStoragePlace?.FREEZER ?? 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm mt-0.5">
                {summaryLoading ? (
                  <Skeleton width={90} />
                ) : (
                  `Faltam ${summary?.pendingShoppingItems ?? 0} itens`
                )}
              </h3>
            </div>

            <div className="my-2 space-y-2">
              {shoppingLoading && (
                <div
                  role="status"
                  aria-label="Carregando lista de compras"
                  className="space-y-2"
                >
                  {[0, 1, 2].map((item) => (
                    <Skeleton key={item} height={14} />
                  ))}
                </div>
              )}
              {!shoppingLoading &&
                shoppingItems
                  .filter((item) => !item.purchased)
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 text-[10px] text-[#536782] dark:text-neutral-300"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-[#D5DEED] dark:border-[#46505B]"
                        />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="shrink-0">
                        {item.quantity} {formatUnitOfMeasure(item.unit)}
                      </span>
                    </div>
                  ))}
              {!shoppingLoading &&
                !shoppingError &&
                shoppingItems.filter((item) => !item.purchased).length ===
                  0 && (
                  <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                    {summary?.pendingShoppingItems
                      ? "Há itens pendentes na sua lista."
                      : "Sua lista de compras está em dia."}
                  </p>
                )}
            </div>

            <Link
              to="/shopping-list"
              className="w-full py-2 px-3 bg-[#2552C8] hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir lista de compras</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs">
          <div className="mb-4">
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Últimas atualizações
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
              Produtos cadastrados no seu estoque
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-100 dark:border-[#343941]">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Quantidade</th>
                  <th className="py-3 px-4">Validade</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-[#343941]/50">
                {recentLoading &&
                  Array.from({ length: 3 }, (_, index) => (
                    <tr key={`loading-${index}`} aria-hidden="true">
                      {["30%", "18%", "16%", "18%", "12%"].map(
                        (width, column) => (
                          <td key={column} className="px-4 py-3.5">
                            <Skeleton width={width} height={14} />
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                {!recentLoading &&
                  recentProducts.map((item) => {
                    const expired = item.productStatus === "EXPIRED";
                    const nearExpiry =
                      item.productStatus === "NEAR_EXPIRATION" ||
                      nearExpiration.some((near) => near.id === item.id);
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold text-frigus-navy dark:text-white">
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`h-4 w-1.5 rounded-full ${expired ? "bg-red-500" : nearExpiry ? "bg-amber-400" : "bg-frigus-primary"}`}
                            />
                            {item.product?.name ?? `Produto ${item.productId}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">
                          {formatProductCategory(item.product?.category ?? item.category)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">
                          {item.quantity} {formatUnitOfMeasure(item.product?.unitOfMeasure)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">
                          {new Date(
                            `${item.expireDate}T12:00:00`,
                          ).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Badge
                            variant={
                              expired
                                ? "danger"
                                : nearExpiry
                                  ? "warning"
                                  : "success"
                            }
                          >
                            {expired
                              ? "Vencido"
                              : nearExpiry
                                ? "Atenção"
                                : "Em dia"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                {!recentLoading && recentProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-xs text-gray-500 dark:text-neutral-400"
                    >
                      {recentError || "Nenhum produto cadastrado ainda."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
