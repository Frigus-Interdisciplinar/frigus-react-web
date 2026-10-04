import { useState } from "react";
import { Edit3, ArrowUpRight, ArrowDownLeft, Info } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialEditBatchModal,
  CommercialRegisterMovementModal,
} from "@/components/CommercialModals";

export default function CommercialBatchDetailsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

  const activities = [
    {
      title: "Saída para a área de venda",
      time: "Hoje, 09:41 · Carlos Lima",
      amount: "−6 kg",
      type: "out",
    },
    {
      title: "Recebimento do fornecedor",
      time: "Ontem, 14:20 · Ana Souza",
      amount: "+20 kg",
      type: "in",
    },
    {
      title: "Saída para produção",
      time: "04 set, 10:08 · Rafael Alves",
      amount: "−8 kg",
      type: "out",
    },
  ];

  return (
    <CommercialLayout
      activeSection="stock"
      breadcrumb="Área comercial    /    Estoque"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55]">
            Detalhes do lote
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Estoque  /  Câmara fria  /  Peito de frango  /  FR-2048
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Edit3 size={15} />
          <span>Editar lote</span>
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Product & Batch specs) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card Produto */}
          <div className="bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#2552C8] border border-blue-100">
                  Proteínas
                </span>
                <h2 className="text-xl font-bold font-montserrat text-[#141C55] mt-2">
                  Peito de frango
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Frigorífico Aurora · Caixa com 20 kg
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-bold text-lg">
                🍗
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  QUANTIDADE DISPONÍVEL
                </span>
                <p className="text-3xl font-bold font-montserrat text-[#141C55] mt-1">
                  32 kg
                </p>
                <span className="text-xs text-[#64748B] mt-0.5 block">
                  Estoque mínimo: 12 kg
                </span>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Acima do mínimo
              </span>
            </div>
          </div>

          {/* Card Informações do Lote */}
          <div className="bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-montserrat text-[#141C55]">
                Informações do lote
              </h2>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Dentro do prazo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5 pt-2">
              <div>
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  CÓDIGO DO LOTE
                </span>
                <p className="text-sm font-bold text-[#141C55] mt-1">FR-2048</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  LOCAL DE ARMAZENAMENTO
                </span>
                <p className="text-sm font-semibold text-[#141C55] mt-1">
                  Câmara fria · Prateleira 02
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  DATA DE ENTRADA
                </span>
                <p className="text-sm font-semibold text-[#141C55] mt-1">02 set 2026</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#64748B] tracking-wider uppercase">
                  DATA DE VALIDADE
                </span>
                <p className="text-sm font-bold text-amber-700 mt-1">18 set 2026</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Movimentações */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#e1e7f0] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-base font-bold font-montserrat text-[#141C55]">
                Histórico de movimentações
              </h2>
              <button
                type="button"
                onClick={() => setIsMovementModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#2552C8] text-[#2552C8] hover:bg-blue-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Registrar movimentação</span>
              </button>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-100">
              {activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      act.type === "in"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                  >
                    {act.type === "in" ? (
                      <ArrowDownLeft size={16} />
                    ) : (
                      <ArrowUpRight size={16} />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#141C55]">{act.title}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{act.time}</p>
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        act.type === "in" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {act.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Callout */}
          <div className="mt-8 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
            <Info size={18} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 font-medium">
              Use primeiro o lote com vencimento mais próximo.
            </p>
          </div>
        </div>
      </div>

      {/* Modais */}
      <CommercialEditBatchModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <CommercialRegisterMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
      />
    </CommercialLayout>
  );
}
