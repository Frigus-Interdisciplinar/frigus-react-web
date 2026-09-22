import { useState } from "react";
import ModalHeader from "./ModalHeader";
import ModalTitle from "./ModalTitle";
import ModalInput from "./ModalInput";
import ModalItemList, { type SuggestedItem } from "./ModalItemList";
import ModalFooter from "./ModalFooter";

export { ModalHeader, ModalTitle, ModalInput, ModalItemList, ModalFooter };
export type { SuggestedItem };

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (selectedItems: string[]) => void;
  title?: string;
  subtitle?: string;
  items?: SuggestedItem[];
  defaultSelectedIds?: string[];
  helperText?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

const defaultSuggestedItems: SuggestedItem[] = [
  { id: "1", name: "Arroz integral", category: "Mercearia", quantity: "1 kg" },
  { id: "2", name: "Peito de frango", category: "Proteínas", quantity: "500 g" },
  { id: "3", name: "Alface crespa", category: "Hortifruti", quantity: "1 un." },
  { id: "4", name: "Iogurte natural", category: "Laticínios", quantity: "4 un." },
];

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = "Adicionar itens à lista",
  subtitle = "Selecione os alimentos que deseja incluir na sua lista",
  items = defaultSuggestedItems,
  defaultSelectedIds = ["1"],
  helperText = "Você pode ajustar as quantidades depois.",
  cancelLabel = "Cancelar",
  confirmLabel = "Adicionar itens",
}: ModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);

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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
        {/* Cabeçalho */}
        <ModalHeader title={title} subtitle={subtitle} onClose={onClose} />

        {/* Campo de Busca */}
        <ModalInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alimento"
        />

        {/* Lista de Alimentos */}
        <ModalItemList
          items={filteredItems}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />

        {/* Rodapé com Ações */}
        <ModalFooter
          helperText={helperText}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={onClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}

// Compound component pattern attachment
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Input = ModalInput;
Modal.ItemList = ModalItemList;
Modal.Footer = ModalFooter;

export { Modal as AddItemModal };

