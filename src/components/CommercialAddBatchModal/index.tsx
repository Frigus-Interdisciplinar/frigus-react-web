import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { CommercialAddBatchModalProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialAddBatchModal({
  isOpen,
  onClose,
  onAdd,
}: CommercialAddBatchModalProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    batchCode: "",
    category: "Proteínas",
    location: "Câmara fria",
    quantity: "0",
    unit: "Quilograma (kg)",
    expiry: "",
    unitCost: "0",
  });
  useResetModalState(isOpen, () => {
    setSuccess("");
    setError("");
    setFormData({
      product: "",
      batchCode: "",
      category: "Proteínas",
      location: "Câmara fria",
      quantity: "0",
      unit: "Quilograma (kg)",
      expiry: "",
      unitCost: "0",
    });
  });

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={() => {
        setSuccess("");
        setError("");
        onClose();
      }}
      title="Adicionar produto ou lote"
      subtitle="Organize a entrada de um produto no estoque."
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              setSuccess("");
              setError("");
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving || Boolean(success)}
            aria-live="polite"
            onClick={async () => {
              const quantity = Number(formData.quantity.replace(",", "."));
              const unitCost = Number(
                formData.unitCost.replace(/[^\d,.-]/g, "").replace(",", "."),
              );
              if (
                !formData.product.trim() ||
                !formData.expiry ||
                !(quantity > 0) ||
                !(unitCost > 0)
              ) {
                setError(
                  "Informe produto, quantidade, validade e custo unitário válidos.",
                );
                return;
              }
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await onAdd?.({ ...formData, quantity, unitCost });
                setFormData({
                  product: "",
                  batchCode: "",
                  category: "Proteínas",
                  location: "Câmara fria",
                  quantity: "0",
                  unit: "Quilograma (kg)",
                  expiry: "",
                  unitCost: "0",
                });
                setSuccess("Produto adicionado ao estoque.");
              } catch {
                setError(
                  "Não foi possível salvar o produto. Confira os dados e tente novamente.",
                );
              } finally {
                setSaving(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {saving ? "Salvando…" : "Adicionar produto"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {error && (
          <p role="alert" className="col-span-2 text-xs text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            aria-live="polite"
            className="col-span-2 text-xs text-emerald-700"
          >
            {success}
          </p>
        )}
        <div className="col-span-2">
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Produto
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-1"
            type="text"
            placeholder="Nome do produto"
            value={formData.product}
            onChange={(e) =>
              setFormData({ ...formData, product: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Identificador do lote (opcional)
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-2"
            type="text"
            value={formData.batchCode}
            onChange={(e) =>
              setFormData({ ...formData, batchCode: e.target.value })
            }
            maxLength={120}
            placeholder="Opcional"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-3"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Categoria
          </label>
          <select
            id="field-components-commercialaddbatchmodal-index-tsx-3"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Proteínas</option>
            <option>Hortifruti</option>
            <option>Mercearia</option>
            <option>Laticínios</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-4"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Local
          </label>
          <select
            id="field-components-commercialaddbatchmodal-index-tsx-4"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Câmara fria</option>
            <option>Depósito</option>
            <option>Área de venda</option>
            <option>Freezers</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-5"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Quantidade
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-5"
            type="text"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-6"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Unidade
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-6"
            type="text"
            placeholder="un / kg / cx"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-7"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Validade
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-7"
            type="date"
            value={formData.expiry}
            onChange={(e) =>
              setFormData({ ...formData, expiry: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div className="col-span-2">
          <label
            htmlFor="field-components-commercialaddbatchmodal-index-tsx-8"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Custo unitário
          </label>
          <input
            id="field-components-commercialaddbatchmodal-index-tsx-8"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="R$ 0,00"
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
