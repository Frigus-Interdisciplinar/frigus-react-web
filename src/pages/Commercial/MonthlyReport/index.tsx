import { useState } from "react";
import { Download } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { StockFlowChart } from "@/components/CommercialCharts";
import { CommercialExportReportModal } from "@/components/CommercialModals";

export default function CommercialMonthlyReportPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const purchaseCategories = [
    { name: "Mercearia", value: "R$ 8.289", percentage: 45 },
    { name: "Hortifruti", value: "R$ 4.605", percentage: 25 },
    { name: "Proteínas", value: "R$ 3.684", percentage: 20 },
    { name: "Outros", value: "R$ 1.842", percentage: 10 },
  ];

  return (
    <CommercialLayout
      activeSection="monthly-report"
      breadcrumb="Área comercial    /    Relatório mensal"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55]">
            Relatório mensal
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            O resultado da operação, com os principais movimentos de agosto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download size={16} />
          <span>Exportar relatório</span>
        </button>
      </div>

      {/* Hero Banner: FECHAMENTO / AGOSTO 2026 */}
      <div className="bg-linear-to-br from-[#131C55] via-[#1E2C7A] to-[#2552C8] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-[#70A2D7] uppercase">
            FECHAMENTO  /  AGOSTO 2026
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div>
              <p className="text-3xl font-bold font-montserrat text-white">R$ 3.420</p>
              <p className="text-xs text-[#c9def9] mt-1">
                Economizados com a redução de perdas
              </p>
            </div>
            <div className="sm:pl-6 pt-4 sm:pt-0">
              <p className="text-3xl font-bold font-montserrat text-emerald-300">−18%</p>
              <p className="text-xs text-[#c9def9] mt-1">
                Desperdício em relação a julho
              </p>
            </div>
            <div className="sm:pl-6 pt-4 sm:pt-0">
              <p className="text-3xl font-bold font-montserrat text-white">R$ 18.420</p>
              <p className="text-xs text-[#c9def9] mt-1">
                Investidos em compras
              </p>
            </div>
          </div>
        </div>

        {/* Decorative soft circles */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/5 blur-xl pointer-events-none" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico de Fluxo de Estoque (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Movimentações de estoque
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Entradas e saídas registradas por semana
            </p>
          </div>
          <StockFlowChart />
        </div>

        {/* Leitura do Mês (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Leitura do mês
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Pontos de destaque na rotina do estabelecimento
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-[#2552C8]/10 text-[#2552C8] font-bold text-xs flex items-center justify-center shrink-0">
                01
              </span>
              <div>
                <p className="text-xs font-bold text-[#141C55]">Menos perdas</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  86 kg descartados, ante 105 kg em julho.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-[#2552C8]/10 text-[#2552C8] font-bold text-xs flex items-center justify-center shrink-0">
                02
              </span>
              <div>
                <p className="text-xs font-bold text-[#141C55]">Orçamento sob controle</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  74% do orçamento de compras utilizado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100">
              <span className="w-7 h-7 rounded-lg bg-[#2552C8]/10 text-[#2552C8] font-bold text-xs flex items-center justify-center shrink-0">
                03
              </span>
              <div>
                <p className="text-xs font-bold text-[#141C55]">Atenção à câmara fria</p>
                <p className="text-xs text-[#64748B] mt-0.5">
                  O setor concentrou 51% do desperdício.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Para onde foram as compras (Full 12 cols) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55]">
              Para onde foram as compras
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Distribuição dos investimentos por categoria de produtos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {purchaseCategories.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-2">
                <span className="text-xs font-medium text-[#64748B]">{cat.name}</span>
                <p className="text-xl font-bold font-montserrat text-[#141C55]">{cat.value}</p>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-[#2552C8] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <CommercialExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </CommercialLayout>
  );
}
