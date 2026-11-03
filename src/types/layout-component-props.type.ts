import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

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
  userName: string;
  planLabel: string;
};
export type AppLayoutProps = {
  activeSection?: SectionString;
  title?: string;
  subtitle?: string;
  userName: string;
  planLabel: string;
  onLogout: () => void;
  children: ReactNode;
};
export type TopbarProps = {
  title?: string;
  subtitle?: string;
  hasNotificationAlert?: boolean;
  activeSection?: SectionString;
  userName: string;
  onLogout: () => void;
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
  userName: string;
};
export type CommercialTopbarProps = {
  breadcrumb?: string;
  userName: string;
  onLogout: () => void;
};
export type CommercialLayoutProps = {
  activeSection?: CommercialSection;
  breadcrumb?: string;
  userName: string;
  onLogout: () => void;
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
  userName: string;
};
export type EnterpriseTopbarProps = {
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
  userName: string;
  onLogout: () => void;
};
export type EnterpriseLayoutProps = {
  children: ReactNode;
  activeSection?: EnterpriseSection;
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
  userName: string;
  onLogout: () => void;
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
export type StockCategoryStat = CategoryStat;
export type StockSidebarProps = {
  stats: CategoryStat[];
  onFilterExpired?: () => void;
};
