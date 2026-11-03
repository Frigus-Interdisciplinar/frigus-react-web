import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useModalFocus } from "@/hooks/useModalFocus";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { AddFoodModalProps, NewFoodData } from "@/types/component-props.type";
export type { AddFoodModalProps, NewFoodData } from "@/types/component-props.type";

type AddFoodFormState = Omit<NewFoodData, "quantity" | "unitPrice"> & {
  quantity: string;
  unitPrice: string;
};
const INITIAL_FORM: AddFoodFormState = {
  name: "",
  category: "GRAIN",
  location: "Despensa",
  quantity: "1",
  unitOfMeasure: "UNIT",
  unitPrice: "",
  expiration: "",
};

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
}: AddFoodModalProps) {
  const [form, setForm] = useState<AddFoodFormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useModalFocus(isOpen, onClose);
  useResetModalState(isOpen, () => {
    setForm({ ...INITIAL_FORM });
    setError("");
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Informe o nome do alimento.");
      return;
    }

    if (!form.expiration) {
      setError("Informe a validade do produto.");
      return;
    }
    if (Number(form.unitPrice) <= 0) {
      setError("Informe um preço unitário maior que zero.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onAdd({
        ...form,
        name: form.name.trim(),
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });

      setForm(INITIAL_FORM);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o produto.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs animate-in fade-in duration-200 sm:items-center">
      <div
        ref={dialogRef}
        id="add-food-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-food-title"
        tabIndex={-1}
        className="relative my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col gap-5 overflow-y-auto overscroll-contain rounded-3xl border border-[#DFE7F2] bg-white p-5 shadow-2xl dark:border-[#343941] dark:bg-[#1C1E22] sm:gap-6 sm:p-8"
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#758198] dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#252A32] hover:text-frigus-navy dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="space-y-1">
          <h2
            id="add-food-title"
            className="font-montserrat font-bold text-2xl text-[#131C55] dark:text-white"
          >
            Adicionar alimento
          </h2>
          <p className="text-sm text-[#758198] dark:text-neutral-400">
            Inclua um alimento no estoque da casa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="add-food-name"
              className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
            >
              NOME DO ALIMENTO
            </label>
            <input
              type="text"
              required
              id="add-food-name"
              maxLength={255}
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              placeholder="Informe o nome"
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="add-food-category"
                className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
              >
                CATEGORIA
              </label>
              <select
                id="add-food-category"
                value={form.category}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    category: e.target.value as NewFoodData["category"],
                  }))
                }
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white focus:outline-hidden focus:border-frigus-primary transition-colors"
              >
                <option value="DAIRY">Laticínios</option>
                <option value="VEGETABLE">Vegetais</option>
                <option value="MEAT">Carnes</option>
                <option value="FRUIT">Frutas</option>
                <option value="GRAIN">Grãos e mercearia</option>
                <option value="BEVERAGE">Bebidas</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="add-food-location"
                className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
              >
                LOCAL
              </label>
              <select
                id="add-food-location"
                value={form.location}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    location: e.target.value as AddFoodFormState["location"],
                  }))
                }
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white focus:outline-hidden focus:border-frigus-primary transition-colors"
              >
                <option value="Despensa">Despensa</option>
                <option value="Geladeira">Geladeira</option>
                <option value="Freezer">Freezer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="add-food-quantity"
                className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
              >
                QUANTIDADE
              </label>
              <div className="flex gap-2">
                <input
                  id="add-food-quantity"
                  type="number"
                  min="0"
                  max="2147483647"
                  step="1"
                  required
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      quantity: e.target.value,
                    }))
                  }
                  className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
                />
                <label htmlFor="add-food-unit" className="sr-only">
                  Unidade de medida
                </label>
                <select
                  id="add-food-unit"
                  value={form.unitOfMeasure}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      unitOfMeasure: e.target
                        .value as NewFoodData["unitOfMeasure"],
                    }))
                  }
                  className="h-12 rounded-xl border border-[#DFE7F2] bg-[#F5F8FC] px-2 text-xs dark:border-[#343941] dark:bg-[#252A32] dark:text-white"
                >
                  <option value="UNIT">un.</option>
                  <option value="KILOGRAM">kg</option>
                  <option value="GRAM">g</option>
                  <option value="LITER">L</option>
                  <option value="MILLILITER">ml</option>
                  <option value="DOZEN">dúzia</option>
                  <option value="PACKAGE">pct.</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="add-food-expiration"
                className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
              >
                VALIDADE
              </label>
              <input
                id="add-food-expiration"
                type="date"
                required
                value={form.expiration}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    expiration: e.target.value,
                  }))
                }
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="add-food-unit-price"
              className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
            >
              PREÇO UNITÁRIO (R$)
            </label>
            <input
              id="add-food-unit-price"
              type="number"
              min="0.01"
              max="10000000"
              step="0.01"
              required
              value={form.unitPrice}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  unitPrice: e.target.value,
                }))
              }
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE7F2] dark:border-[#343941] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl border border-[#DFE7F2] dark:border-[#343941] text-sm font-semibold text-[#131C55] dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              aria-live="polite"
              className="h-10 px-6 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {saving ? "Salvando…" : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
