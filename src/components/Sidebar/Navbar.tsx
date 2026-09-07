import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Utensils,
  ShoppingBasket,
  UsersRound,
  MessageCircle,
  Settings,
} from "lucide-react";
import NavigationItem from "./NavigationItem";
import frigusLogo from "@/assets/frigus-logo.svg";

export type SectionString =
  | "home"
  | "stock"
  | "recipe"
  | "shopping-list"
  | "family-members"
  | "chat"
  | "settings"
  | "alerts"
  | "profile"
  | "plans"
  | "notifications"
  | undefined;

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  section: SectionString;
};

const navigationItems: NavItem[] = [
  { label: "Visão geral", href: "/home", icon: <LayoutDashboard size={18} />, section: "home" },
  { label: "Estoque", href: "/stock", icon: <Package size={18} />, section: "stock" },
  { label: "Receitas", href: "/recipe", icon: <Utensils size={18} />, section: "recipe" },
  { label: "Compras", href: "/shopping-list", icon: <ShoppingBasket size={18} />, section: "shopping-list" },
  { label: "Família", href: "/family-members", icon: <UsersRound size={18} />, section: "family-members" },
  { label: "Chat", href: "/chat", icon: <MessageCircle size={18} />, section: "chat" },
  { label: "Configurações", href: "/settings", icon: <Settings size={18} />, section: "settings" },
];

type SidebarProps = {
  activeSection: SectionString;
};

export default function Sidebar({ activeSection }: SidebarProps) {
  return (
    <aside className="h-screen sticky top-0 bg-sidebar-bg w-60 p-4 flex flex-col justify-between shrink-0 select-none z-20">
      {/* Header com Logo */}
      <div className="flex flex-col gap-6">
        <Link to="/home" className="flex items-center gap-2.5 px-3 pt-2 hover:opacity-90 transition-opacity">
          <img src={frigusLogo} alt="Frigus Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-white text-lg tracking-wider font-semibold">
            FRIGUS
          </span>
        </Link>

        {/* Links de Navegação */}
        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.href}
              item={item}
              active={activeSection === item.section}
            />
          ))}
        </nav>
      </div>

      {/* Perfil do Usuário na Base */}
      <Link
        to="/profile"
        className="pt-4 border-t border-white/10 flex items-center gap-3 px-2 hover:bg-white/5 rounded-lg transition-colors py-2"
      >
        <div className="w-9 h-9 rounded-full bg-frigus-ice flex items-center justify-center text-frigus-navy font-bold text-xs shrink-0">
          HP
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white text-xs font-bold truncate">Henrique Paulo</span>
          <span className="text-sidebar-muted text-[11px] truncate">Plano doméstico</span>
        </div>
      </Link>
    </aside>
  );
}