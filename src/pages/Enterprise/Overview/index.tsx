import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Megaphone, Eye, MousePointerClick, ShoppingBag, ArrowRight } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import { EnterpriseCreateAdModal } from "@/components/EnterpriseModals";

export default function EnterpriseOverviewPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const featuredAds = [
    {
      name: "Kit brunch artesanal",
      category: "Congelados",
      views: "31,6 mil",
      status: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      name: "Leite de amêndoas 1 L",
      category: "Bebidas",
      views: "24,8 mil",
      status: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      name: "Omelete de espinafre",
      category: "Prontos",
      views: "19,7 mil",
      status: "Pausado",
      statusColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    },
    {
      name: "Tomate-cereja premium",
      category: "Hortifruti",
      views: "15,4 mil",
      status: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
  ];

  const operationalAlerts = [
    {
      count: "03",
      title: "Aguardam revisão",
      desc: "Confira fotos e informações",
      badgeColor: "bg-blue-50 dark:bg-blue-950/50 text-[#2552C8] dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
    },
    {
      count: "02",
      title: "Rascunhos",
      desc: "Continue a publicação",
      badgeColor: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50",
    },
    {
      count: "05",
      title: "Vencem neste mês",
      desc: "Revise o período de exibição",
      badgeColor: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
    },
  ];

  return (
    <EnterpriseLayout
      activeSection="overview"
      breadcrumb="Área empresarial    /    Visão geral"
      onOpenCreateAd={() => setIsCreateModalOpen(true)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Visão geral
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Acompanhe o que está chamando atenção para a Rede Aurora.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Criar anúncio</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Anúncios ativos */}
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Anúncios ativos
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2552C8] dark:text-blue-400 flex items-center justify-center">
              <Megaphone size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              18
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            3 aguardam revisão
          </p>
        </div>

        {/* Visualizações */}
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Visualizações
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Eye size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              128,4 mil
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            últimos 30 dias
          </p>
        </div>

        {/* Taxa de clique */}
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Taxa de cliques
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <MousePointerClick size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              5,7%
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            taxa de conversão saudável
          </p>
        </div>

        {/* Pedidos atribuídos */}
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
              Pedidos atribuídos
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
              312
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
            no período corrente
          </p>
        </div>
      </div>

      {/* Main Grid: Destaques (7 cols) + Operação (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Anúncios em destaque (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Anúncios em destaque
              </h2>
              <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
                Produtos mais vistos neste mês
              </p>
            </div>
            <Link
              to="/enterprise/ads"
              className="text-xs font-semibold text-[#2552C8] dark:text-blue-400 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Produto</th>
                  <th className="py-2.5 px-3">Visitas</th>
                  <th className="py-2.5 px-3 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {featuredAds.map((ad, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/70 dark:hover:bg-[#252A32]/50 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-bold text-[#141C55] dark:text-white">
                          {ad.name}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
                          {ad.category}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#141C55] dark:text-white">
                      {ad.views}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ad.statusColor}`}
                      >
                        {ad.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operação dos anúncios (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Operação dos anúncios
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              O que precisa da sua atenção
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {operationalAlerts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#F5F8FC]/80 dark:bg-[#252A32]/50 border border-gray-100 dark:border-[#343941]/60"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${item.badgeColor}`}
                >
                  {item.count}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#141C55] dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/enterprise/ads"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2552C8] dark:text-blue-400 hover:gap-3 transition-all"
            >
              <span>Gerenciar anúncios</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EnterpriseCreateAdModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </EnterpriseLayout>
  );
}
