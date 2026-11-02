import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { ModalVisibilityProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

type BatchFormData = {
  product: string;
  batchCode: string;
  category: string;
  location: string;
  quantity: string;
  unit: string;
  expiry: string;
  unitCost: string;
};

export function CommercialEditBatchModal({
  isOpen,
  onClose,
  initialData,
}: ModalVisibilityProps & { initialData: BatchFormData }) {
  const [formData, setFormData] = useState(initialData);
  useResetModalState(isOpen, () => {
    setFormData(initialData);
  });

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Editar lote"
      subtitle="Atualize as informações do lote selecionado."
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
            Salvar alterações
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Produto
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-1"
            type="text"
            value={formData.product}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Código do lote
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-2"
            type="text"
            value={formData.batchCode}
            onChange={(e) =>
              setFormData({ ...formData, batchCode: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-3"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Categoria
          </label>
          <select
            id="field-components-commercialeditbatchmodal-index-tsx-3"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Proteínas</option>
            <option>Hortifruti</option>
            <option>Mercearia</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-4"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Local
          </label>
          <select
            id="field-components-commercialeditbatchmodal-index-tsx-4"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Câmara fria</option>
            <option>Depósito</option>
            <option>Área de venda</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-5"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Quantidade
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-5"
            type="text"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-6"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Unidade
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-6"
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-7"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Validade
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-7"
            type="text"
            value={formData.expiry}
            onChange={(e) =>
              setFormData({ ...formData, expiry: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="field-components-commercialeditbatchmodal-index-tsx-8"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Custo unitário
          </label>
          <input
            id="field-components-commercialeditbatchmodal-index-tsx-8"
            type="text"
            value={formData.unitCost}
            onChange={(e) =>
              setFormData({ ...formData, unitCost: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}
