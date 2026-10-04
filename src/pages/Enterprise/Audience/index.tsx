import { useState } from "react";
import { Users, UserPlus, RotateCcw, MapPin } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { AgeDemographicsChart, RegionsChart } from "@/components/EnterpriseCharts";
import { EnterpriseCreateAdModal } from "@/components/EnterpriseModals";

export default function EnterpriseAudiencePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <EnterpriseLayout
      activeSection="audience"
      breadcrumb="Área empresarial    /    Público atingido"
      onOpenCreateAd={() => setIsCreateOpen(true)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Público atingido
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Veja quem está encontrando seus produtos e em quais regiões.
          </p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Pessoas alcançadas
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2552C8] dark:text-blue-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              48,2 mil
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +16% neste mês
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Novos visitantes
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UserPlus size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              12,8 mil
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            26,5% do alcance total
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Retorno recorrente
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <RotateCcw size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              34,2%
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            acima da média do setor
          </p>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Regiões ativas
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <MapPin size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              27
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            estados e polos alcançados
          </p>
        </div>
      </div>

      {/* Main Grid: Faixa etária (6 cols) + Alcance por região (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Faixa etária */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Faixa etária
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Distribuição demográfica dos visitantes
            </p>
          </div>

          <AgeDemographicsChart />
        </div>

        {/* Alcance por região */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Alcance por região
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Onde os produtos foram mais vistos
            </p>
          </div>

          <RegionsChart />
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
