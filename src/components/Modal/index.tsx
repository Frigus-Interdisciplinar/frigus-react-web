import { useState } from "react";
import { useModalFocus } from "@/hooks/useModalFocus";
import { useResetModalState } from "@/hooks/useResetModalState";
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
  onConfirm?: (selectedItems: string[]) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  items?: SuggestedItem[];
  defaultSelectedIds?: string[];
  helperText?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title = "Adicionar itens à lista",
  subtitle = "Selecione os alimentos que deseja incluir na sua lista",
  items = [],
  defaultSelectedIds = [],
  helperText = "Você pode ajustar as quantidades depois.",
  cancelLabel = "Cancelar",
  confirmLabel = "Adicionar itens",
}: ModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const dialogRef = useModalFocus(isOpen, onClose);
  useResetModalState(isOpen, () => {
    setSearch("");
    setSelectedIds([...defaultSelectedIds]);
    setConfirmError("");
  });

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleConfirm = async () => {
    setConfirming(true);
    setConfirmError("");
    try {
      await onConfirm?.(selectedIds);
      onClose();
    } catch (reason) {
      setConfirmError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível adicionar os itens.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        ref={dialogRef}
        id="add-items-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-items-dialog-title"
        tabIndex={-1}
        className="bg-white dark:bg-[#1C1E22] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-[#343941] flex flex-col"
      >
        <ModalHeader title={title} subtitle={subtitle} onClose={onClose} />

        <ModalInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar alimento"
        />

        {filteredItems.length > 0 ? (
          <ModalItemList
            items={filteredItems}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <p role="status" className="px-6 py-8 text-center text-sm text-gray-500">
            Nenhum item disponível no catálogo.
          </p>
        )}
        {confirmError && (
          <p role="alert" className="px-6 text-sm text-red-600">
            {confirmError}
          </p>
        )}

        <ModalFooter
          helperText={helperText}
          cancelLabel={cancelLabel}
          onCancel={onClose}
          onConfirm={handleConfirm}
          confirmLabel={confirming ? "Adicionando…" : confirmLabel}
          confirmDisabled={confirming}
        />
      </div>
    </div>
  );
}
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Input = ModalInput;
Modal.ItemList = ModalItemList;
Modal.Footer = ModalFooter;

export { default as AddFoodModal } from "./AddFoodModal";
export { default as EditFoodModal } from "./EditFoodModal";
export { default as InviteMemberModal } from "./InviteMemberModal";
export { Modal as AddItemModal, Modal as AddShoppingItemsModal };
