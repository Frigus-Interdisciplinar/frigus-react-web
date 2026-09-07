import { useState } from "react";
import { X, Search, Check } from "lucide-react";
import { cn } from "@/utils/cn.util";

type AddItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (selectedItems: string[]) => void;
  title?: string;
  subtitle?: string;
};

type SuggestedItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
};

const defaultSuggestedItems: SuggestedItem[] = [
  { id: "1", name: "Arroz integral", category: "Mercearia", quantity: "1 kg" },
  { id: "2", name: "Peito de frango", category: "Proteínas", quantity: "500 g" },
  { id: "3", name: "Alface crespa", category: "Hortifruti", quantity: "1 un." },
  { id: "4", name: "Iogurte natural", category: "Laticínios", quantity: "4 un." },
];

export default function AddItemModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Adicionar itens à lista",
  subtitle = "Selecione os alimentos que deseja incluir na sua lista",
}: AddItemModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(["1"]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm?.(selectedIds);
    onClose();
  };

  const filteredItems = defaultSuggestedItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
        {/* Cabeçalho */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-gray-100">
          <div>
            <h3 className="font-montserrat font-bold text-frigus-navy text-xl">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 font-sans">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-frigus-navy hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Campo de Busca */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar alimento"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-frigus-primary focus:ring-2 focus:ring-frigus-primary/10 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Lista de Alimentos */}
        <div className="p-6 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Alimentos sugeridos
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none",
                    isChecked
                      ? "border-frigus-primary bg-blue-50/50 shadow-xs"
                      : "border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                        isChecked
                          ? "bg-frigus-primary border-frigus-primary text-white"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-frigus-navy">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-frigus-primary px-2.5 py-1 bg-white rounded-lg border border-blue-100">
                    {item.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400 text-center sm:text-left">
            Você pode ajustar as quantidades depois.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/60 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-frigus-primary hover:bg-blue-700 transition-colors shadow-sm"
            >
              Adicionar itens
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
