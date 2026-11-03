import type { ModalVisibilityProps } from "@/types/modal-component-props.type";

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
export type CommercialWasteProduct = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
};
export type CommercialAddBatchModalProps = ModalVisibilityProps & {
  onAdd?: (input: CommercialBatchInput) => Promise<void>;
};
export type CommercialRegisterWasteModalProps = ModalVisibilityProps & {
  products: CommercialWasteProduct[];
  onRecord: (data: {
    stockProductId: number;
    quantity: number;
    reason: string;
  }) => Promise<void>;
};
export type CommercialRegisterPurchaseModalProps = ModalVisibilityProps & {
  onCreate?: (input: {
    description: string;
    category: string;
    amount: number;
    expenseDate: string;
    supplier: string;
  }) => Promise<void>;
};
export type CommercialInviteEmployeeModalProps = ModalVisibilityProps & {
  onInvite?: (input: {
    name: string;
    email: string;
    memberRole: "EDITOR" | "VIEWER";
  }) => Promise<void>;
};
export type CommercialManageAccessModalProps = ModalVisibilityProps & {
  employeeName: string;
  employeeEmail: string;
  memberRole: "EDITOR" | "VIEWER";
  onSaveRole: (role: "EDITOR" | "VIEWER") => Promise<void>;
};
export type CommercialFilterStockModalProps = ModalVisibilityProps & {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
};
export type CommercialCompletePurchaseModalProps = ModalVisibilityProps & {
  totalItems: number;
  totalAmount: string;
  date?: string;
  responsible?: string;
};
export type CommercialResendInviteModalProps = ModalVisibilityProps & {
  name: string;
  email: string;
};
