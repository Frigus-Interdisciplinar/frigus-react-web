import type { ReactNode } from "react";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export type CommercialBatchInput = {
  product: string;
  batchCode?: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  expiry: string;
  unitCost: number;
};

export interface ModalVisibilityProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CommercialAddBatchModalProps extends ModalVisibilityProps {
  onAdd?: (input: CommercialBatchInput) => Promise<void>;
}

export interface CommercialWasteProduct {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface CommercialRegisterWasteModalProps extends ModalVisibilityProps {
  products: CommercialWasteProduct[];
  onRecord: (data: {
    stockProductId: number;
    quantity: number;
    reason: string;
  }) => Promise<void>;
}

export interface CommercialRegisterPurchaseModalProps extends ModalVisibilityProps {
  onCreate?: (input: {
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
    supplier: string;
  }) => Promise<void>;
}

export interface CommercialInviteEmployeeModalProps extends ModalVisibilityProps {
  onInvite?: (input: {
    name: string;
    email: string;
    memberRole: "EDITOR" | "VIEWER";
  }) => Promise<void>;
}

export interface CommercialManageAccessModalProps extends ModalVisibilityProps {
  employeeName?: string;
  employeeEmail?: string;
  memberRole?: "EDITOR" | "VIEWER";
  onSaveRole?: (role: "EDITOR" | "VIEWER") => Promise<void>;
}

export interface CommercialFilterStockModalProps extends ModalVisibilityProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export interface CommercialCompletePurchaseModalProps extends ModalVisibilityProps {
  totalItems?: number;
  totalAmount?: string;
}

export interface CommercialResendInviteModalProps extends ModalVisibilityProps {
  name?: string;
  email?: string;
}
