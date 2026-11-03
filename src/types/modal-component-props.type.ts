import type { ComponentProps, ReactNode } from "react";

export type SuggestedItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
};
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
export type ModalTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};
export type ModalInputProps = ComponentProps<"input"> & {
  icon?: ReactNode;
};
export type ModalHeaderProps = {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
};
export type ModalFooterProps = {
  helperText?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  onCancel: () => void;
  onConfirm?: () => void;
  className?: string;
  children?: ReactNode;
};
export type ModalItemListProps = {
  items: SuggestedItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  sectionTitle?: string;
  emptyMessage?: string;
};
export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};
export type ModalVisibilityProps = {
  isOpen: boolean;
  onClose: () => void;
};
