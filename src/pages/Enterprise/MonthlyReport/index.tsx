import { useState } from "react";
import { Calendar, TrendingUp, Sparkles, Clock, ArrowRight } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { WeeklyViewsChart } from "@/components/EnterpriseCharts";
import { EnterpriseCreateAdModal } from "@/components/EnterpriseModals";

export default function EnterpriseMonthlyReportPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <EnterpriseLayout
      activeSection="report"
      breadcrumb="Área empresarial    /    Relatório mensal"
      onOpenCreateAd={() => setIsCreateOpen(true)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Relatório mensal
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Uma leitura rápida do que os anúncios geraram neste mês.
          </p>
        </div>
      </div>

      {/* Top Banner / Período */}
      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-400 flex items-center justify-center">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
              SETEMBRO 2026 · 01 A 30
            </span>
            <p className="text-sm font-bold text-[#141C55] dark:text-white mt-0.5">
              Atualizado hoje com dados consolidados
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#2552C8] dark:text-blue-400 hover:gap-3 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span>Trocar período</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-6 rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
            Visualizações
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white">
              128,4 mil
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              +18% ante agosto
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            em anúncios ativos
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-6 rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
            Cliques
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white">
              7.260
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              +12% ante agosto
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            interações diretas no app
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-6 rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
            Pedidos atribuídos
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white">
              312
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              +8% ante agosto
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            conversões comprovadas
          </p>
        </div>
      </div>

      {/* Main Grid: Evolução semanal (7 cols) + Resumo do mês (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico Evolução Semanal */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Evolução semanal
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Visualizações e cliques por semana
            </p>
          </div>

          <WeeklyViewsChart />
        </div>

        {/* Resumo do mês */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Resumo do mês
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Leitura dos principais destaques
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Mais visto */}
            <div className="p-4 rounded-2xl bg-[#F5F8FC]/80 dark:bg-[#252A32]/60 border border-gray-100 dark:border-[#343941] space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500" />
                MAIS VISTO
              </span>
              <p className="text-sm font-bold text-[#141C55] dark:text-white">
                Kit brunch artesanal
              </p>
              <p className="text-xs text-[#64748B] dark:text-neutral-400">
                31,6 mil visualizações acumuladas
              </p>
            </div>

            {/* Maior crescimento */}
            <div className="p-4 rounded-2xl bg-[#F5F8FC]/80 dark:bg-[#252A32]/60 border border-gray-100 dark:border-[#343941] space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={12} className="text-emerald-500" />
                MAIOR CRESCIMENTO
              </span>
              <p className="text-sm font-bold text-[#141C55] dark:text-white">
                Omelete de espinafre
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                +24% no mês corrente
              </p>
            </div>

            {/* Melhor horário */}
            <div className="p-4 rounded-2xl bg-[#F5F8FC]/80 dark:bg-[#252A32]/60 border border-gray-100 dark:border-[#343941] space-y-1">
              <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} className="text-[#2552C8] dark:text-blue-400" />
                MELHOR HORÁRIO
              </span>
              <p className="text-sm font-bold text-[#141C55] dark:text-white">
                18h–20h
              </p>
              <p className="text-xs text-[#64748B] dark:text-neutral-400">
                Pico de visitas nos canais parceiros
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EnterpriseCreateAdModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </EnterpriseLayout>
  );
}
