import { useState } from "react";
import { Check } from "lucide-react";
import type { CommercialFilterStockModalProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialFilterStockModal({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}: CommercialFilterStockModalProps) {
  const [current, setCurrent] = useState(
    selectedCategory || "Todas as categorias",
  );

  const categories = [
    "Todas as categorias",
    "Proteínas",
    "Hortifruti",
    "Mercearia",
  ];

  const handleConfirm = () => {
    if (onSelectCategory) onSelectCategory(current);
    onClose();
  };

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Filtrar estoque"
      subtitle="Selecione a categoria que deseja visualizar."
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
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Ver resultados
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {categories.map((cat) => {
            const isSelected = current === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCurrent(cat)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2552C8] bg-blue-50/50 text-[#141C55]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check size={16} className="text-[#2552C8]" />}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#64748B] leading-relaxed pt-2 border-t border-gray-100">
          Você também pode buscar pelo nome do produto, pelo fornecedor ou pelo
          código do lote.
        </p>
      </div>
    </CommercialModalBase>
  );
}
