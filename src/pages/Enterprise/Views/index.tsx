import { useState } from "react";
import { Download, Users, Eye, TrendingUp } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { ViewsByPeriodChart } from "@/components/EnterpriseCharts";
import { EnterpriseCreateAdModal } from "@/components/EnterpriseModals";

export default function EnterpriseViewsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const productRanking = [
    {
      rank: "01",
      name: "Kit brunch artesanal",
      category: "Congelados",
      views: "31,6 mil",
      share: 32,
    },
    {
      rank: "02",
      name: "Leite de amêndoas 1 L",
      category: "Bebidas",
      views: "24,8 mil",
      share: 25,
    },
    {
      rank: "03",
      name: "Omelete de espinafre",
      category: "Prontos",
      views: "19,7 mil",
      share: 20,
    },
    {
      rank: "04",
      name: "Tomate-cereja premium",
      category: "Hortifruti",
      views: "15,4 mil",
      share: 15,
    },
    {
      rank: "05",
      name: "Wrap de falafel",
      category: "Padaria",
      views: "12,2 mil",
      share: 8,
    },
  ];

  return (
    <EnterpriseLayout
      activeSection="views"
      breadcrumb="Área empresarial    /    Visualizações"
      onOpenCreateAd={() => setIsCreateOpen(true)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Visualizações por produto
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Compare quais anúncios estão trazendo mais atenção.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="inline-flex items-center gap-2 bg-white dark:bg-[#1C1E22] border border-[#E1E7F0] dark:border-[#343941] text-[#141C55] dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download size={16} />
          <span>Exportar dados</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-400 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              48,2 mil
            </p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">
              Visitantes únicos
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Eye size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              128,4 mil
            </p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">
              Visualizações totais
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              4,2 mil
            </p>
            <span className="text-xs text-[#64748B] dark:text-neutral-400">
              Média diária
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visitas por período (7 cols) + Ranking por produto (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visitas por período */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Visitas por período
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Por semana · setembro 2026
            </p>
          </div>

          <ViewsByPeriodChart />
        </div>

        {/* Ranking por produto */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Ranking por produto
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Participação nas visualizações
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {productRanking.map((prod) => (
              <div key={prod.rank} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[#2552C8] dark:text-blue-400">
                      {prod.rank}
                    </span>
                    <span className="font-bold text-[#141C55] dark:text-white">
                      {prod.name}
                    </span>
                  </div>
                  <span className="text-[#64748B] dark:text-neutral-400 font-semibold">
                    {prod.views} ({prod.share}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F5F8FC] dark:bg-[#252A32] overflow-hidden">
                  <div
                    style={{ width: `${prod.share}%` }}
                    className="h-full bg-linear-to-r from-[#2552C8] to-[#467bf7] rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            ))}
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
