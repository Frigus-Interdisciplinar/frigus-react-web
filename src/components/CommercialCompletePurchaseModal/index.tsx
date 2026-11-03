import type { CommercialCompletePurchaseModalProps } from "@/types/component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialCompletePurchaseModal({
  isOpen,
  onClose,
  totalItems,
  totalAmount,
  date,
  responsible,
}: CommercialCompletePurchaseModalProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Concluir compra"
      subtitle="Confira o resumo antes de finalizar."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Confirmar compra
          </button>
        </>
      }
    >
      <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/70">
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <span className="text-xs text-[#64748B]">Itens</span>
          <span className="text-xs font-bold text-[#141C55]">
            {totalItems} produtos
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <span className="text-xs text-[#64748B]">Valor total</span>
          <span className="text-sm font-bold text-emerald-600">
            {totalAmount}
          </span>
        </div>
        {date && (
          <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
            <span className="text-xs text-[#64748B]">Data</span>
            <span className="text-xs font-semibold text-[#141C55]">{date}</span>
          </div>
        )}
        {responsible && (
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-[#64748B]">Responsável</span>
            <span className="text-xs font-semibold text-[#141C55]">{responsible}</span>
          </div>
        )}
      </div>
    </CommercialModalBase>
  );
}
