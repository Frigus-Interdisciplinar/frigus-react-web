import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, TrendingDown, ArrowRight, ShieldAlert } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { WasteTrendChart, WasteDonutChart } from "@/components/CommercialCharts";
import { CommercialRegisterWasteModal } from "@/components/CommercialModals";

export default function CommercialWastePage() {
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);

  const sectorWaste = [
    { sector: "Câmara fria", amount: "44 kg", percentage: 51 },
    { sector: "Produção", amount: "24 kg", percentage: 28 },
    { sector: "Depósito", amount: "18 kg", percentage: 21 },
  ];

  return (
    <CommercialLayout
      activeSection="waste"
      breadcrumb="Área comercial    /    Desperdícios"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55]">
            Dashboard de desperdícios
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Entenda as perdas e encontre as próximas oportunidades de redução.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsWasteModalOpen(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <AlertOctagon size={16} />
          <span>Registrar perda</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Perdas em agosto</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] mt-1">86 kg</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingDown size={14} /> 18% menos que em julho
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Custo das perdas</span>
          <p className="text-2xl font-bold font-montserrat text-red-600 mt-1">R$ 1.214</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Custo dos produtos descartados</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Taxa de desperdício</span>
          <p className="text-2xl font-bold font-montserrat text-amber-600 mt-1">4,2%</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Meta da operação: até 3,5%</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Meta de setembro</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] mt-1">74 kg</p>
          <span className="text-[11px] text-[#2552C8] font-semibold mt-1 block">12 kg a menos para descartar</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico 1: As perdas estão diminuindo (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              As perdas estão diminuindo
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Volume descartado por período (kg)
            </p>
          </div>
          <WasteTrendChart />
        </div>

        {/* Gráfico 2: Motivos do desperdício (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Motivos do desperdício
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Composição das perdas registradas no mês
            </p>
          </div>
          <WasteDonutChart />
        </div>

        {/* Setores de Atenção (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Onde concentrar atenção
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Setores que mais registraram perdas no período
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {sectorWaste.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#141C55]">{item.sector}</span>
                  <span className="font-semibold text-gray-700">{item.amount} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    style={{ width: `${item.percentage}%` }}
                    className="h-full bg-linear-to-r from-red-500 to-rose-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próxima Ação Callout (5 cols) */}
        <div className="lg:col-span-5 bg-amber-500/10 border border-amber-300/60 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-800">
              <ShieldAlert size={20} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                PRÓXIMA AÇÃO
              </span>
            </div>
            <h3 className="text-lg font-bold font-montserrat text-[#141C55] mt-2">
              7 lotes vencem em até 3 dias
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Priorize a saída desses produtos na rotina de preparo para evitar descartes adicionais.
            </p>
          </div>

          <Link
            to="/commercial/validity"
            className="w-full py-3 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Revisar validades</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Modal */}
      <CommercialRegisterWasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
      />
    </CommercialLayout>
  );
}
