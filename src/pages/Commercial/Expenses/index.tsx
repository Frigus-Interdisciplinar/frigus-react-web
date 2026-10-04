import { useState } from "react";
import { Plus } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { WeeklySpendingChart } from "@/components/CommercialCharts";
import { CommercialRegisterPurchaseModal } from "@/components/CommercialModals";

export default function CommercialExpensesPage() {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const recentOrders = [
    {
      id: "#PC-0826-012",
      supplier: "Distribuidora Alfa",
      value: "R$ 1.490,00",
      status: "Recebido",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      id: "#PC-0826-011",
      supplier: "Hortifruti Central",
      value: "R$ 840,00",
      status: "Em trânsito",
      statusColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
    },
    {
      id: "#PC-0826-010",
      supplier: "Atacadista Bom Preço",
      value: "R$ 620,00",
      status: "A aprovar",
      statusColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    },
  ];

  const upcomingPayments = [
    {
      day: "07",
      month: "SET",
      supplier: "Distribuidora Alfa",
      value: "R$ 1.490,00",
    },
    {
      day: "10",
      month: "SET",
      supplier: "Hortifruti Central",
      value: "R$ 840,00",
    },
  ];

  return (
    <CommercialLayout
      activeSection="expenses"
      breadcrumb="Área comercial    /    Gastos e compras"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Gastos e compras
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Acompanhe o orçamento, os pedidos e os próximos pagamentos.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPurchaseModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Registrar compra</span>
        </button>
      </div>

      {/* Top Banner: Orçamento Agosto 2026 */}
      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 tracking-wider uppercase">
              ORÇAMENTO / AGOSTO 2026
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white">
                R$ 18.420
              </span>
              <span className="text-xs text-[#64748B] dark:text-neutral-400">
                de R$ 25.000 planejados
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            R$ 6.580 disponíveis
          </span>
        </div>

        {/* Budget Progress Bar */}
        <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-[#252A32] overflow-hidden">
          <div className="h-full bg-linear-to-r from-[#2552C8] to-[#467bf7] rounded-full w-[74%]" />
        </div>
      </div>

      {/* Main Grid: Gráfico + Pedidos e Pagamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gráfico Compras ao Longo do Mês (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Compras ao longo do mês
              </h2>
              <p className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 tracking-wider uppercase mt-0.5">
                VALOR EM REAIS
              </p>
            </div>
          </div>
          <WeeklySpendingChart />
        </div>

        {/* Right: Próximos pagamentos (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
              Próximos pagamentos
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              Vencem nos próximos 7 dias
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {upcomingPayments.map((pay, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-[#252A32]/60 border border-gray-100 dark:border-[#343941]/60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex flex-col items-center justify-center text-[#2552C8] dark:text-blue-400">
                    <span className="text-xs font-bold leading-none">{pay.day}</span>
                    <span className="text-[9px] font-bold tracking-wider leading-none mt-0.5">{pay.month}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#141C55] dark:text-white">{pay.supplier}</p>
                    <p className="text-[11px] text-[#64748B] dark:text-neutral-400">Boleto bancário</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#141C55] dark:text-white">{pay.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-[#343941] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">Total previsto</span>
            <span className="text-sm font-bold text-[#141C55] dark:text-white">R$ 2.330,00</span>
          </div>
        </div>

        {/* Pedidos Recentes (Full 12 cols) */}
        <div className="lg:col-span-12 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Pedidos recentes
              </h2>
              <p className="text-xs text-[#64748B] dark:text-neutral-400">Últimas compras registradas para a operação</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-300">
              12 pedidos no mês
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Pedido / Fornecedor</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70 dark:hover:bg-[#252A32]/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#141C55] dark:text-white">{order.id}</span>
                      <span className="text-[#64748B] dark:text-neutral-400 ml-2">· {order.supplier}</span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#141C55] dark:text-white">{order.value}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CommercialRegisterPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </CommercialLayout>
  );
}
