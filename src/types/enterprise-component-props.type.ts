import type { ReactNode } from "react";
import type { ModalVisibilityProps } from "@/types/modal-component-props.type";

export type EnterpriseModalBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
};
export type EnterpriseModalVisibilityProps = ModalVisibilityProps;
export type EnterpriseEditAdModalProps = EnterpriseModalVisibilityProps & {
  initialData: {
    name: string;
    category: string;
    price: string;
    startDate: string;
    endDate: string;
    description: string;
  };
};
export type EnterprisePauseAdModalProps = EnterpriseModalVisibilityProps & {
  product: { name: string; category: string };
};
export type EnterpriseFinishAdModalProps = EnterpriseModalVisibilityProps & {
  product: { name: string; category: string; price: string };
};
