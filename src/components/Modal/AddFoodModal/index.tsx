import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type NewFoodData = {
  name: string;
  category: "FRUIT" | "VEGETABLE" | "DAIRY" | "GRAIN" | "MEAT" | "BEVERAGE";
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: number;
  unitOfMeasure: "KILOGRAM" | "GRAM" | "LITER" | "MILLILITER" | "UNIT" | "DOZEN" | "PACKAGE";
  unitPrice: number;
  expiration: string;
};

export type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodData) => Promise<void>;
};

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
}: AddFoodModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<NewFoodData["category"]>("GRAIN");
  const [location, setLocation] = useState<"Despensa" | "Geladeira" | "Freezer">("Despensa");
  const [quantity, setQuantity] = useState("1");
  const [unitOfMeasure, setUnitOfMeasure] = useState<NewFoodData["unitOfMeasure"]>("UNIT");
  const [unitPrice, setUnitPrice] = useState("");
  const [expiration, setExpiration] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!expiration) { setError("Informe a validade do produto."); return; }
    if (Number(unitPrice) <= 0) { setError("Informe um preço unitário maior que zero."); return; }
    setSaving(true);
    setError("");
    try {
      await onAdd({ name: name.trim(), category, location, quantity: Number(quantity), unitOfMeasure, unitPrice: Number(unitPrice), expiration });

    // Reset and close
    setName("");
    setCategory("GRAIN");
    setLocation("Despensa");
    setQuantity("1");
    setUnitOfMeasure("UNIT");
    setUnitPrice("");
    setExpiration("");
    onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o produto.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#DFE7F2] dark:border-[#343941] p-8 relative flex flex-col gap-6">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#758198] dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#252A32] hover:text-frigus-navy dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-1">
          <h2 className="font-montserrat font-bold text-2xl text-[#131C55] dark:text-white">
            Adicionar alimento
          </h2>
          <p className="text-sm text-[#758198] dark:text-neutral-400">
            Inclua um alimento no estoque da casa.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome do alimento */}
          <div>
            <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">
              NOME DO ALIMENTO
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Informe o nome"
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
            />
          </div>

          {/* Categoria e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">
                CATEGORIA
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewFoodData["category"])}
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
              <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">
                LOCAL
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as "Despensa" | "Geladeira" | "Freezer")}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white focus:outline-hidden focus:border-frigus-primary transition-colors"
              >
                <option value="Despensa">Despensa</option>
                <option value="Geladeira">Geladeira</option>
                <option value="Freezer">Freezer</option>
              </select>
            </div>
          </div>

          {/* Quantidade e Validade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">
                QUANTIDADE
              </label>
              <div className="flex gap-2">
              <input
                type="number" min="1" step="1" required
                value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
              <select value={unitOfMeasure} onChange={(e) => setUnitOfMeasure(e.target.value as NewFoodData["unitOfMeasure"])} className="h-12 rounded-xl border border-[#DFE7F2] bg-[#F5F8FC] px-2 text-xs dark:border-[#343941] dark:bg-[#252A32] dark:text-white">
                <option value="UNIT">un.</option><option value="KILOGRAM">kg</option><option value="GRAM">g</option><option value="LITER">L</option><option value="MILLILITER">ml</option><option value="DOZEN">dúzia</option><option value="PACKAGE">pct.</option>
              </select></div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">
                VALIDADE
              </label>
              <input
                type="date"
                required
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white placeholder:text-[#758198] dark:placeholder:text-neutral-500 focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#131C55] dark:text-neutral-200 uppercase tracking-wider block mb-2">PREÇO UNITÁRIO (R$)</label>
            <input type="number" min="0.01" step="0.01" required value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#DFE7F2] dark:border-[#343941] text-sm text-[#131C55] dark:text-white" />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {/* Ações */}
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
