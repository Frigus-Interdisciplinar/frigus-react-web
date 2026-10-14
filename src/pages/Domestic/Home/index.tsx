import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { getInventorySummary, type StockSummary } from "@/services/inventory.service";
import { useStore } from "@/store/store";
import AdvertisementShelf from "@/components/AdvertisementShelf";

export default function DashboardPage() {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");
  const user = useStore((state) => state.user);
  useEffect(() => { void getInventorySummary().then(setSummary).catch((error: unknown) => setSummaryError(error instanceof Error ? error.message : "Não foi possível carregar o resumo.")); }, []);
  const nearExpiration = summary?.nearExpiration ?? [];
  const readyPercentage = summary?.itemCount ? Math.round((summary.itemCount - nearExpiration.length) / summary.itemCount * 100) : 0;
  const consumedCount = Object.values(summary?.consumedThisWeek ?? {}).reduce((total, count) => total + count, 0);
  return (
    <AppLayout activeSection="home">
      <div className="space-y-6">
        {/* Cabeçalho de Boas-Vindas */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
            Olá, {user?.name ?? "bem-vindo(a)"}
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
            Uma visão clara para aproveitar melhor cada item
          </p>
        </div>

        <AdvertisementShelf />

        {/* Linha Superior: Hero Card + Card Para Usar Primeiro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero Banner (8 colunas) */}
          <div className="lg:col-span-8 bg-frigus-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            {/* Círculos decorativos de fundo */}
            <div className="absolute right-40 -top-10 w-48 h-48 rounded-full bg-frigus-accent/30 pointer-events-none blur-xl" />
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-frigus-ice/20 pointer-events-none blur-lg" />

            <div className="relative z-10 space-y-3 max-w-md">
              <span className="text-[11px] uppercase tracking-wider font-bold text-frigus-ice font-sans">
                Sua casa hoje
              </span>
              <h2 className="font-montserrat font-bold text-2xl md:text-[26px] leading-tight">
                {nearExpiration.length} {nearExpiration.length === 1 ? "item pede" : "itens pedem"} atenção
              </h2>
              <p className="text-frigus-ice text-sm font-sans leading-relaxed">
                Você ainda consegue usá-los antes da validade.
              </p>
              <div className="pt-2">
                <Link
                  to="/alerts"
                  className="inline-flex items-center gap-2 bg-frigus-accent hover:bg-[#F2BD50] text-frigus-navy px-4 py-2 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Ver itens</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Insight Card interno */}
            <div className="relative z-10 w-full md:w-56 bg-frigus-navy/90 dark:bg-[#0B1020]/95 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between shrink-0 shadow-lg">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-frigus-ice">
                  Estoque em dia
                </span>
                <div className="font-montserrat font-bold text-3xl text-white mt-1">
                  {readyPercentage}%
                </div>
                <span className="text-xs text-frigus-ice/80">dos itens sem alerta</span>
              </div>

              {/* Sparkline bars */}
              <div className="flex items-end gap-1.5 h-10 mt-4 pt-1">
                <div className="w-2.5 h-4 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-5 bg-frigus-ice rounded-xs" />
                <div className="w-2.5 h-10 bg-frigus-accent rounded-xs" />
                <div className="w-2.5 h-7 bg-frigus-ice rounded-xs" />
              </div>
            </div>
          </div>

          {/* Para usar primeiro (4 colunas) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Para usar primeiro
              </h3>
              <Link
                to="/alerts"
                className="text-xs font-bold text-frigus-primary dark:text-[#5B89F7] hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="h-px bg-gray-100 dark:bg-[#343941] my-4" />

            <div className="space-y-4">
              {nearExpiration.slice(0, 2).map((item) => <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 bg-red-400 rounded-full" />
                  <div>
                    <h4 className="text-sm font-bold text-frigus-navy dark:text-white group-hover:text-frigus-primary dark:group-hover:text-[#5B89F7] transition-colors">
                      {item.product?.name ?? `Produto ${item.productId}`}
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-neutral-400">{item.quantity} un. · validade {new Date(`${item.expireDate}T12:00:00`).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <Badge variant={item.productStatus === "EXPIRED" ? "danger" : "warning"}>{item.productStatus === "EXPIRED" ? "Vencido" : "Em breve"}</Badge>
              </div>)}
              {nearExpiration.length === 0 && <p className="text-sm text-gray-500 dark:text-neutral-400">{summaryError || "Nenhum produto próximo da validade."}</p>}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#343941] flex items-center justify-between text-xs text-gray-400 dark:text-neutral-400">
              <span>Evite desperdícios na despensa</span>
              <ArrowRight size={14} className="text-gray-400 dark:text-neutral-500" />
            </div>
          </div>
        </div>

        {/* Linha Intermediária: Consumo da Semana + Distribuição + Próxima Compra */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Consumo da Semana (5 colunas) */}
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

            {/* Gráfico de Barras */}
            <div className="mt-6">
              <div className="relative h-32 flex items-end justify-between px-4 pb-6 border-b border-gray-100 dark:border-[#343941]">
                {/* Linhas de referência sutis */}
                <div className="absolute inset-x-0 top-2 border-t border-dashed border-gray-100 dark:border-[#343941]" />
                <div className="absolute inset-x-0 top-14 border-t border-dashed border-gray-100 dark:border-[#343941]" />

                {/* Barras por dia */}
                {[
                  { day: "S", h: "35%", color: "bg-frigus-primary dark:bg-[#5B89F7]" },
                  { day: "T", h: "65%", color: "bg-frigus-primary dark:bg-[#5B89F7]" },
                  { day: "Q", h: "50%", color: "bg-frigus-primary dark:bg-[#5B89F7]" },
                  { day: "Q", h: "80%", color: "bg-frigus-secondary dark:bg-[#3D6CE5]" },
                  { day: "S", h: "55%", color: "bg-frigus-primary dark:bg-[#5B89F7]" },
                  { day: "S", h: "90%", color: "bg-frigus-ice dark:bg-[#92ACF7]" },
                  { day: "D", h: "70%", color: "bg-frigus-primary dark:bg-[#5B89F7]" },
                ].map((col, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 relative z-10 w-7"
                  >
                    <div
                      className={`w-full ${col.color} rounded-lg transition-all duration-300 hover:brightness-110`}
                      style={{ height: col.h }}
                    />
                    <span className="text-[11px] font-medium text-gray-400 dark:text-neutral-400">
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribuição do Estoque (3 colunas) */}
          <div className="md:col-span-3 bg-frigus-navy dark:bg-[#15181E] border border-transparent dark:border-[#343941] text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-frigus-ice dark:text-neutral-400">
                Distribuição
              </span>
              <h3 className="font-montserrat font-bold text-white text-base mt-0.5">
                Seu estoque
              </h3>
            </div>

            {/* Donut central simples com CSS */}
            <div className="my-4 flex items-center justify-center">
              <div className="relative w-28 h-28 rounded-full border-8 border-frigus-ice dark:border-[#2C303B] flex items-center justify-center border-t-frigus-primary border-r-frigus-accent border-l-[#6D91EA]">
                <div className="text-center">
                  <span className="font-montserrat font-bold text-2xl text-white block leading-none">
                    {summary?.itemCount ?? 0}
                  </span>
                  <span className="text-[10px] text-frigus-ice dark:text-neutral-400 uppercase tracking-wider font-semibold">
                    itens
                  </span>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-frigus-ice dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-ice dark:bg-neutral-400" />
                  Despensa
                </span>
                <span className="font-bold text-white">{summary?.itemsByStoragePlace?.PANTRY ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-primary" />
                  Geladeira
                </span>
                <span className="font-bold text-white">{summary?.itemsByStoragePlace?.FRIDGE ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-frigus-accent" />
                  Frescos
                </span>
                <span className="font-bold text-white">{(summary?.itemsByStoragePlace?.PANTRY ?? 0) + (summary?.itemsByStoragePlace?.SHELF ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between text-frigus-ice dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#6D91EA]" />
                  Congelados
                </span>
                <span className="font-bold text-white">{summary?.itemsByStoragePlace?.FREEZER ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Próxima Compra (4 colunas) */}
          <div className="md:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-neutral-400">
                Próxima compra
              </span>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base mt-0.5">
                Faltam {summary?.pendingShoppingItems ?? 0} itens
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-neutral-400 my-4">{summary?.pendingShoppingItems ? "Há itens pendentes na sua lista." : "Sua lista de compras está em dia."}</p>

            <Link
              to="/shopping-list"
              className="w-full py-2.5 px-4 bg-frigus-navy dark:bg-frigus-primary hover:bg-slate-900 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Abrir lista de compras</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Linha Inferior: Últimas Atualizações (Tabela) */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs">
          <div className="mb-4">
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Últimas atualizações
            </h3>
            <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
              Seu estoque foi atualizado pelo aplicativo
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
                <tr className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-frigus-navy dark:text-white flex items-center gap-2.5">
                    <div className="w-1.5 h-4 bg-frigus-primary rounded-full" />
                    Leite
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">Laticínios</td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">2 un.</td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">14 nov.</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success">Em dia</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-frigus-navy dark:text-white flex items-center gap-2.5">
                    <div className="w-1.5 h-4 bg-frigus-ice rounded-full" />
                    Arroz integral
                  </td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">Despensa</td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">1 kg</td>
                  <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">28 nov.</td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="success">Em dia</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
