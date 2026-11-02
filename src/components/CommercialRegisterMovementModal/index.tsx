import type { ModalVisibilityProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialRegisterMovementModal({
  isOpen,
  onClose,
}: ModalVisibilityProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar movimentação"
      subtitle="Toda entrada e saída fica no histórico do lote."
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
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Registrar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="field-components-commercialregistermovementmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Produto / lote
          </label>
          <input
            id="field-components-commercialregistermovementmodal-index-tsx-1"
            type="text"
            placeholder="Selecione ou informe o produto e o lote"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialregistermovementmodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Tipo
          </label>
          <select
            id="field-components-commercialregistermovementmodal-index-tsx-2"
            defaultValue=""
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option value="" disabled>Selecione o tipo</option>
            <option value="OUT">Saída</option>
            <option value="IN">Entrada</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialregistermovementmodal-index-tsx-3"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Quantidade
          </label>
          <input
            id="field-components-commercialregistermovementmodal-index-tsx-3"
            type="text"
            placeholder="Informe a quantidade"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialregistermovementmodal-index-tsx-4"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Destino
          </label>
          <input
            id="field-components-commercialregistermovementmodal-index-tsx-4"
            type="text"
            placeholder="Informe o destino"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}
