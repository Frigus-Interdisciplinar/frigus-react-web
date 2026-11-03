import { useState } from "react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { CommercialRegisterWasteModalProps } from "@/types/component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialRegisterWasteModal({
  isOpen,
  onClose,
  products,
  onRecord,
}: CommercialRegisterWasteModalProps) {
  const [form, setForm] = useState({
    stockProductId: 0,
    quantity: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  useResetModalState(isOpen, () => {
    setForm({ stockProductId: 0, quantity: "", reason: "" });
    setError("");
    setSuccess("");
  });
  const selectedStockProductId = form.stockProductId || products[0]?.id || 0;
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={() => {
        setSuccess("");
        setError("");
        onClose();
      }}
      title="Registrar perda"
      subtitle="Informe o lote e a quantidade retirada do estoque."
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
              const count = Number(form.quantity);
              if (!selectedStockProductId || !(count > 0)) {
                setError(
                  "Escolha um lote e informe uma quantidade maior que zero.",
                );
                return;
              }
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await onRecord({
                  stockProductId: selectedStockProductId,
                  quantity: count,
                  reason: form.reason,
                });
                setForm((current) => ({ ...current, quantity: "" }));
                setSuccess("Perda registrada no estoque.");
              } catch {
                setError(
                  "Não foi possível registrar a perda. Confira o saldo do lote.",
                );
              } finally {
                setSaving(false);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {saving ? "Registrando…" : "Registrar perda"}
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
            htmlFor="commercial-waste-product"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Produto / lote
          </label>
          <select
            id="commercial-waste-product"
            value={selectedStockProductId}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                stockProductId: Number(e.target.value),
              }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-white"
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} · saldo {product.quantity} {product.unit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="commercial-waste-quantity"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Quantidade
          </label>
          <input
            id="commercial-waste-quantity"
            type="number"
            min="1"
            step="1"
            value={form.quantity}
            onChange={(e) =>
              setForm((current) => ({ ...current, quantity: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label
            htmlFor="commercial-waste-reason"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Motivo (opcional)
          </label>
          <select
            id="commercial-waste-reason"
            value={form.reason}
            onChange={(e) =>
              setForm((current) => ({ ...current, reason: e.target.value }))
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option value="">Não informar</option>
            <option>Validade expirada</option>
            <option>Manuseio / Avaria</option>
            <option>Transporte</option>
            <option>Excesso de preparo</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}
