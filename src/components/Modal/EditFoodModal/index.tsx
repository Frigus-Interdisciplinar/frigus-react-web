import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useModalFocus } from "@/hooks/useModalFocus";
import type { EditFoodFormProps, EditFoodModalProps, FoodItemData } from "@/types/domestic-component-props.type";
export type { EditFoodModalProps, FoodItemData } from "@/types/domestic-component-props.type";

function EditFoodForm({ initialData, onClose, onSave }: EditFoodFormProps) {
  const [form, setForm] = useState({
    name: initialData.name,
    category: initialData.category,
    location: initialData.location,
    quantity: initialData.quantity,
    expiration: initialData.expiration,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);
    setError("");
    try {
      await onSave?.({
        id: initialData.id,
        name: form.name.trim(),
        category: form.category,
        location: form.location,
        quantity: form.quantity.trim(),
        expiration: form.expiration.trim(),
      });
      onClose();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível salvar as alterações.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="edit-food-name"
          className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
        >
          NOME DO ALIMENTO
        </label>
        <input
          id="edit-food-name"
          type="text"
          required
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
            htmlFor="edit-food-category"
            className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
          >
            CATEGORIA
          </label>
          <select
            id="edit-food-category"
            value={form.category}
            onChange={(e) =>
              setForm((current) => ({ ...current, category: e.target.value }))
            }
            className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white focus:outline-hidden focus:border-frigus-primary transition-colors"
          >
            <option value="Laticínios">Laticínios</option>
            <option value="Vegetais">Vegetais</option>
            <option value="Carnes">Carnes</option>
            <option value="Frutas">Frutas</option>
            <option value="Grãos">Grãos</option>
            <option value="Mercearia">Mercearia</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Peixes">Peixes</option>
            <option value="Congelados">Congelados</option>
            <option value="Doces">Doces</option>
            <option value="Enlatados">Enlatados</option>
            <option value="Temperos">Temperos</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Higiene pessoal">Higiene pessoal</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="edit-food-location"
            className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
          >
            LOCAL
          </label>
          <select
            id="edit-food-location"
            value={form.location}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                location: e.target.value as FoodItemData["location"],
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
            htmlFor="edit-food-quantity"
            className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
          >
            QUANTIDADE
          </label>
          <input
            id="edit-food-quantity"
            type="text"
            required
            maxLength={32}
            value={form.quantity}
            onChange={(e) =>
              setForm((current) => ({ ...current, quantity: e.target.value }))
            }
            placeholder="Informe a quantidade"
            className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="edit-food-expiration"
            className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2"
          >
            VALIDADE
          </label>
          <input
            id="edit-food-expiration"
            type="date"
            required
            value={form.expiration}
            onChange={(e) =>
              setForm((current) => ({ ...current, expiration: e.target.value }))
            }
            placeholder="Informe a validade"
            className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE7F2] dark:border-[#343941] mt-2">
        <button
          type="button"
          disabled={saving}
          onClick={onClose}
          className="h-10 px-6 rounded-xl border border-[#DFE7F2] dark:border-[#343941] text-sm font-semibold text-[#131C55] dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-10 px-6 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
}

export default function EditFoodModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditFoodModalProps) {
  const dialogRef = useModalFocus(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs animate-in fade-in duration-200 sm:items-center">
      <div
        ref={dialogRef}
        id="edit-food-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-food-title"
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
            id="edit-food-title"
            className="font-montserrat font-bold text-2xl text-[#131C55] dark:text-white"
          >
            Editar alimento
          </h2>
          <p className="text-sm text-[#758198] dark:text-neutral-400">
            Atualize as informações do item.
          </p>
        </div>

        <EditFoodForm
          key={initialData.id ?? initialData.name}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
