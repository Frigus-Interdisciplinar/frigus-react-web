import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

export type FoodItemData = {
  id?: string;
  name: string;
  category: string;
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: string;
  expiration: string;
};

export type EditFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: FoodItemData) => void;
  initialData?: FoodItemData;
};

const defaultData: FoodItemData = {
  name: "Leite integral",
  category: "Laticínios",
  location: "Geladeira",
  quantity: "2 L",
  expiration: "18 ago 2026",
};

function EditFoodForm({
  initialData,
  onClose,
  onSave,
}: {
  initialData: FoodItemData;
  onClose: () => void;
  onSave?: (data: FoodItemData) => void;
}) {
  const [name, setName] = useState(initialData.name);
  const [category, setCategory] = useState(initialData.category);
  const [location, setLocation] = useState(initialData.location);
  const [quantity, setQuantity] = useState(initialData.quantity);
  const [expiration, setExpiration] = useState(initialData.expiration);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave?.({
      id: initialData.id,
      name,
      category,
      location,
      quantity,
      expiration,
    });
    onClose();
  };

  return (
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
          className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] focus:outline-hidden focus:border-frigus-primary transition-colors"
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
            placeholder="Informe a quantidade"
            className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] focus:outline-hidden focus:border-frigus-primary transition-colors"
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
            placeholder="Informe a validade"
            className="w-full h-12 px-4 rounded-xl bg-[#F5F8FC] border border-[#DFE7F2] text-sm text-[#131C55] focus:outline-hidden focus:border-frigus-primary transition-colors"
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
          Salvar
        </button>
      </div>
    </form>
  );
}

export default function EditFoodModal({
  isOpen,
  onClose,
  onSave,
  initialData = defaultData,
}: EditFoodModalProps) {
  if (!isOpen) return null;

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
            Editar alimento
          </h2>
          <p className="text-sm text-[#758198]">
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
