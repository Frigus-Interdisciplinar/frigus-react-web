import type { ComponentProps, CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { AccountType } from "@/types/auth.type";

export type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
};

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "discrete"
  | "accent"
  | "destructive"
  | "outline";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "accent";

export type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label?: ReactNode;
};

export type BrandLogoProps = {
  surface: "light" | "dark" | "theme";
  className?: string;
};

export type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

export type SkeletonProps = {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
};

export type SkeletonRowsProps = {
  rows?: number;
  className?: string;
  rowClassName?: string;
};

export type SkeletonCardProps = {
  children: ReactNode;
  className?: string;
};

export type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (idToken: string) => void;
  onError: (message: string) => void;
};

export type ThemeToggleProps = {
  className?: string;
};

export type AuthGuardProps = {
  children: ReactNode;
  accountType?: AccountType;
  allowPlanSelection?: boolean;
};

export type AuthLayoutProps = {
  title: ReactNode;
  description: ReactNode;
  cardTitle: string;
  cardDescription: ReactNode;
  children: ReactNode;
};

export type AuthSidebarProps = Omit<AuthLayoutProps, "children">;

export type AuthBenefitCardProps = {
  cardTitle: string;
  cardDescription: ReactNode;
};

export type SectionString =
  | "home"
  | "stock"
  | "recipe"
  | "shopping-list"
  | "family-members"
  | "chat"
  | "chat-ai"
  | "settings"
  | "alerts"
  | "profile"
  | "plans"
  | "notifications"
  | undefined;

export type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  section: SectionString;
};

export type NavItemProps = {
  item: NavItem;
  active: boolean;
};

export type SidebarProps = {
  activeSection?: SectionString;
};

export type AppLayoutProps = {
  activeSection?: SectionString;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export type TopbarProps = {
  title?: string;
  subtitle?: string;
  hasNotificationAlert?: boolean;
  activeSection?: SectionString;
};

export type QuickNotice = {
  id: string;
  title: string;
  description: string;
  type: "warning" | "stock" | "invite";
  link?: string;
};

export type QuickNotificationsPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type CommercialSection =
  | "stock"
  | "validity"
  | "shopping-list"
  | "monthly-report"
  | "waste"
  | "expenses"
  | "employees"
  | "profile"
  | "settings"
  | "notifications";

export type CommercialSidebarProps = {
  activeSection?: CommercialSection;
};

export type CommercialTopbarProps = {
  breadcrumb?: string;
};

export type CommercialLayoutProps = {
  activeSection?: CommercialSection;
  breadcrumb?: string;
  children: ReactNode;
};

export type EnterpriseSection =
  | "overview"
  | "ads"
  | "report"
  | "views"
  | "audience"
  | "profile"
  | "settings"
  | "notifications";

export type EnterpriseSidebarProps = {
  activeSection?: EnterpriseSection;
};

export type EnterpriseTopbarProps = {
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
};

export type EnterpriseLayoutProps = {
  children: ReactNode;
  activeSection?: EnterpriseSection;
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
};

export type MobileNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type MobileNavigationProps = {
  label: string;
  items: MobileNavigationItem[];
};

export type CategoryStat = {
  name: string;
  count: number;
  color: string;
  percentage: number;
};

export type StockSidebarProps = {
  stats: CategoryStat[];
  onFilterExpired?: () => void;
};

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

export type StockCategoryStat = CategoryStat;

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

export type NewFoodData = {
  name: string;
  category: "FRUIT" | "VEGETABLE" | "DAIRY" | "GRAIN" | "MEAT" | "BEVERAGE";
  location: "Despensa" | "Geladeira" | "Freezer";
  quantity: number;
  unitOfMeasure:
    | "KILOGRAM"
    | "GRAM"
    | "LITER"
    | "MILLILITER"
    | "UNIT"
    | "DOZEN"
    | "PACKAGE";
  unitPrice: number;
  expiration: string;
};

export type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodData) => Promise<void>;
};

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
  onSave?: (data: FoodItemData) => void | Promise<void>;
  initialData: FoodItemData;
};

export type EditFoodFormProps = Omit<EditFoodModalProps, "isOpen">;

export type InviteMemberData = {
  name: string;
  email: string;
  role: "Pode editar" | "Visualizar";
};

export type InviteMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteMemberData) => Promise<void>;
  householdName?: string;
};

export type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

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

export type ModalVisibilityProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type CommercialAddBatchModalProps = ModalVisibilityProps & {
  onAdd?: (input: CommercialBatchInput) => Promise<void>;
};

export type CommercialWasteProduct = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
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
