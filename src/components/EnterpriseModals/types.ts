export interface EnterpriseModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export interface EnterpriseModalVisibilityProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EnterpriseEditAdModalProps extends EnterpriseModalVisibilityProps {
  initialData?: {
    name: string;
    category: string;
    price: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}

export interface EnterprisePauseAdModalProps extends EnterpriseModalVisibilityProps {
  product?: { name: string; category: string };
}

export interface EnterpriseFinishAdModalProps extends EnterpriseModalVisibilityProps {
  product?: { name: string; category: string; price: string };
}
