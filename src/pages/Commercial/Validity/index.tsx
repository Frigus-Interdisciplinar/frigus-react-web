import { useState } from "react";
import { AlertOctagon, AlertCircle } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { CommercialRegisterWasteModal } from "@/components/CommercialModals";

export default function CommercialValidityPage() {
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);

  const expiryPriorities = [
    {
      product: "Iogurte natural food service",
      batch: "YG-082 · Câmara fria",
      quantity: "12 caixas",
      date: "05 set",
      status: "Vencido",
      statusColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      product: "Pão brioche",
      batch: "PB-119 · Área de venda",
      quantity: "8 pacotes",
      date: "04 set",
      status: "Vencido",
      statusColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      product: "Tomate italiano para molho",
      batch: "TM-318 · Câmara fria",
      quantity: "24 kg",
      date: "08 set",
      status: "Em 2 dias",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      product: "Peito de frango",
      batch: "FR-2052 · Câmara fria",
      quantity: "18 kg",
      date: "09 set",
      status: "Em 3 dias",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  const lowStockItems = [
    {
      product: "Arroz parboilizado 5 kg",
      minimum: "Mínimo: 20",
      available: "6 pacotes disponíveis",
      percentage: 30,
    },
    {
      product: "Óleo de soja 5 L",
      minimum: "Mínimo: 8",
      available: "2 unidades disponíveis",
      percentage: 25,
    },
    {
      product: "Queijo muçarela fatiado",
      minimum: "Mínimo: 15 kg",
      available: "4 kg disponíveis",
      percentage: 26,
    },
  ];

  return (
    <CommercialLayout activeSection="validity" breadcrumb="Área comercial    /    Validades">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Controle de validade e quantidade
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Acompanhe vencimentos e níveis de estoque em uma única lista.
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

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-red-100 dark:border-red-950/60 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">Vencidos</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              Ação imediata
            </span>
          </div>
          <p className="text-3xl font-bold font-montserrat text-red-600 dark:text-red-400 mt-2">5</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">lotes para retirar</span>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-amber-100 dark:border-amber-950/60 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">Próximos do vencimento</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              Usar primeiro
            </span>
          </div>
          <p className="text-3xl font-bold font-montserrat text-amber-600 dark:text-amber-400 mt-2">7</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">vencem em até 3 dias</span>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-orange-100 dark:border-orange-950/60 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">Quantidade baixa</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
              Repor estoque
            </span>
          </div>
          <p className="text-3xl font-bold font-montserrat text-orange-600 dark:text-orange-400 mt-2">12</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">abaixo do mínimo</span>
        </div>
      </div>

      {/* Main Two Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Prioridades de vencimento (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Prioridades de vencimento
              </h2>
              <p className="text-xs text-[#64748B] dark:text-neutral-400">Lotes que precisam de atenção primeiro.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-900/50">
              4 prioridades
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#343941] text-[11px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Produto / Lote</th>
                  <th className="py-2.5 px-3">Quantidade</th>
                  <th className="py-2.5 px-3">Validade</th>
                  <th className="py-2.5 px-3 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {expiryPriorities.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[#141C55] dark:text-white">{item.product}</p>
                      <p className="text-[11px] text-[#64748B] dark:text-neutral-400">{item.batch}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#141C55] dark:text-white">{item.quantity}</td>
                    <td className="py-3 px-3 text-gray-600 dark:text-neutral-300">{item.date}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Painel Direito: Reposição necessária (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                  Reposição necessária
                </h2>
                <p className="text-xs text-[#64748B] dark:text-neutral-400">Itens abaixo da quantidade mínima.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/50">
                12 itens
              </span>
            </div>

            <div className="space-y-4 pt-2">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-[#141C55] dark:text-white">{item.product}</h3>
                    <span className="text-[11px] text-gray-500 dark:text-neutral-400 font-medium">{item.minimum}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">{item.available}</span>
                    <span className="text-gray-400 dark:text-neutral-500 text-[10px]">{item.percentage}% do ideal</span>
                  </div>
                  {/* Track Bar */}
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3">
            <AlertCircle size={18} className="text-[#2552C8] dark:text-blue-400 shrink-0" />
            <p className="text-[11px] text-[#141C55] dark:text-blue-200 leading-snug">
              Produtos com quantidade crítica são enviados automaticamente como sugestão para a <strong>Lista de Compras</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Registrar Perda */}
      <CommercialRegisterWasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
      />
    </CommercialLayout>
  );
}
