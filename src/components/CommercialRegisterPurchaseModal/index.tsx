import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { CommercialRegisterPurchaseModalProps } from "@/components/CommercialModals/types";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialRegisterPurchaseModal({
  isOpen,
  onClose,
  onCreate,
}: CommercialRegisterPurchaseModalProps) {
  const [form, setForm] = useState({
    description: "",
    supplier: "",
    amount: "",
    expenseDate: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  useResetModalState(isOpen, () => {
    setForm({
      description: "",
      supplier: "",
      amount: "",
      expenseDate: new Date().toISOString().slice(0, 10),
    });
    setError("");
    setSuccess("");
  });
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={() => {
        setSuccess("");
        setError("");
        onClose();
      }}
      title="Registrar compra"
      subtitle="Registre os valores e acompanhe o pedido."
      footer={
        <>
          <button
            type="button"
            disabled={saving}
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
              const numericAmount = Number(form.amount.replace(",", "."));
              if (
                !form.description.trim() ||
                !(numericAmount > 0) ||
                !form.expenseDate
              ) {
                setError("Informe descrição, valor e data válidos.");
                return;
              }
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await onCreate?.({
                  description: form.description.trim(),
                  category: "Compras",
                  amount: numericAmount,
                  expenseDate: form.expenseDate,
                  supplier: form.supplier.trim(),
                });
                setForm({
                  description: "",
                  supplier: "",
                  amount: "",
                  expenseDate: new Date().toISOString().slice(0, 10),
                });
                setSuccess("Compra registrada.");
              } catch {
                setError("Não foi possível registrar a compra.");
              } finally {
                setSaving(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {saving ? "Salvando…" : "Salvar compra"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {error && (
          <p role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p
            role="status"
            aria-live="polite"
            className="text-xs text-emerald-700"
          >
            {success}
          </p>
        )}
        <div>
          <label
            htmlFor="commercial-purchase-description"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Descrição
          </label>
          <input
            id="commercial-purchase-description"
            type="text"
            maxLength={255}
            placeholder="Ex.: compra de reposição"
            value={form.description}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-purchase-supplier"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Fornecedor (opcional)
          </label>
          <input
            id="commercial-purchase-supplier"
            type="text"
            maxLength={255}
            placeholder="Nome do fornecedor (opcional)"
            value={form.supplier}
            onChange={(e) =>
              setForm((current) => ({ ...current, supplier: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-purchase-amount"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Valor total
          </label>
          <input
            id="commercial-purchase-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(e) =>
              setForm((current) => ({ ...current, amount: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-purchase-date"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Data da compra
          </label>
          <input
            id="commercial-purchase-date"
            type="date"
            value={form.expenseDate}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                expenseDate: e.target.value,
              }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialregisterpurchasemodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Data da compra
          </label>
          <input
            id="field-components-commercialregisterpurchasemodal-index-tsx-1"
            type="text"
            defaultValue="06/09/2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialregisterpurchasemodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Situação
          </label>
          <select
            id="field-components-commercialregisterpurchasemodal-index-tsx-2"
            defaultValue="A aprovar"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>A aprovar</option>
            <option>Em trânsito</option>
            <option>Recebido</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}
