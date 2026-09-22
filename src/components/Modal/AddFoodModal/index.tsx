import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type NewFoodData = {
  name: string;
  category: string;
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: string;
  expiration: string;
};

export type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodData) => void;
};

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
}: AddFoodModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<"Despensa" | "Geladeira" | "Freezer">("Despensa");
  const [quantity, setQuantity] = useState("");
  const [expiration, setExpiration] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      category: category || "Mercearia",
      location,
      quantity: quantity || "1 un",
      expiration: expiration || "Em 7 dias",
    });

    // Reset and close
    setName("");
    setCategory("");
    setLocation("Despensa");
    setQuantity("");
    setExpiration("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#DFE7F2] p-8 relative flex flex-col gap-6">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center text-[#758198] hover:bg-gray-100 hover:text-frigus-navy transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div className="space-y-1">
          <h2 className="font-montserrat font-bold text-2xl text-[#131C55]">
            Adicionar alimento
          </h2>
          <p className="text-sm text-[#758198]">
            Inclua um alimento no estoque da casa.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome do alimento */}
          <div>
            <label className="text-xs font-semibold text-[#131C55] uppercase tracking-wider block mb-2">
              NOME DO ALIMENTO
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Informe o nome"
              className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] placeholder:text-[#758198] focus:outline-hidden focus:border-frigus-primary transition-colors"
            />
          </div>

          {/* Categoria e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#131C55] uppercase tracking-wider block mb-2">
                CATEGORIA
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] focus:outline-hidden focus:border-frigus-primary transition-colors"
              >
                <option value="">Selecione a categoria</option>
                <option value="Laticínios">Laticínios</option>
                <option value="Vegetais">Vegetais</option>
                <option value="Carnes">Carnes</option>
                <option value="Frutas">Frutas</option>
                <option value="Grãos">Grãos</option>
                <option value="Mercearia">Mercearia</option>
                <option value="Congelados">Congelados</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131C55] uppercase tracking-wider block mb-2">
                LOCAL
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as "Despensa" | "Geladeira" | "Freezer")}
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] focus:outline-hidden focus:border-frigus-primary transition-colors"
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
              <label className="text-xs font-semibold text-[#131C55] uppercase tracking-wider block mb-2">
                QUANTIDADE
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Informe a quantidade (ex: 2 un, 1 kg)"
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] placeholder:text-[#758198] focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#131C55] uppercase tracking-wider block mb-2">
                VALIDADE
              </label>
              <input
                type="text"
                required
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                placeholder="Informe a validade (ex: 20 out)"
                className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] placeholder:text-[#758198] focus:outline-hidden focus:border-frigus-primary transition-colors"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFE7F2] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 rounded-xl border border-[#DFE7F2] text-sm font-semibold text-[#131C55] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
