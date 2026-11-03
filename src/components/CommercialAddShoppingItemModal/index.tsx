import type { ModalVisibilityProps } from "@/types/modal-component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialAddShoppingItemModal({
  isOpen,
  onClose,
}: ModalVisibilityProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar item à lista"
      subtitle="Planeje a reposição do estabelecimento."
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
            Adicionar à lista
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="field-components-commercialaddshoppingitemmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Produto
          </label>
          <input
            id="field-components-commercialaddshoppingitemmodal-index-tsx-1"
            type="text"
            placeholder="Nome do produto"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddshoppingitemmodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Quantidade
          </label>
          <input
            id="field-components-commercialaddshoppingitemmodal-index-tsx-2"
            type="text"
            placeholder="Ex.: 12 caixas"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddshoppingitemmodal-index-tsx-3"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Fornecedor
          </label>
          <input
            id="field-components-commercialaddshoppingitemmodal-index-tsx-3"
            type="text"
            placeholder="Selecione o fornecedor"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddshoppingitemmodal-index-tsx-4"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Valor estimado
          </label>
          <input
            id="field-components-commercialaddshoppingitemmodal-index-tsx-4"
            type="text"
            placeholder="R$ 0,00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}
