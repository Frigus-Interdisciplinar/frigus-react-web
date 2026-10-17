import {
  LayoutDashboard,
  Package,
  Utensils,
  ShoppingBasket,
  UsersRound,
  MessageCircle,
  Settings,
  CreditCard,
  Building2,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import frigusLogo from "@/assets/frigus-logo.svg";
import { useStore } from "@/store/store";
import { logout } from "@/services/auth.service";

export type SectionString =
  | "home"
  | "stock"
  | "recipe"
  | "shopping-list"
  | "family-members"
  | "chat"
  | "settings"
  | "plans"
  | "commercial"
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
  { label: "Planos", href: "/plans", icon: <CreditCard size={18} />, section: "plans" },
  { label: "Comercial", href: "/commercial", icon: <Building2 size={18} />, section: "commercial" },
  { label: "Configurações", href: "/settings", icon: <Settings size={18} />, section: "settings" },
];

type SidebarProps = {
  activeSection: SectionString;
};

export default function Sidebar({ activeSection }: SidebarProps) {
  const user = useStore((state) => state.user);
  const navigate = useNavigate();
  const initials = user?.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("") || "?";
  return (
    <aside className="h-screen sticky top-0 bg-sidebar-bg w-60 p-4 flex flex-col justify-between shrink-0 select-none">
      {/* Header com Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2.5 px-3 pt-2">
          <img src={frigusLogo} alt="Frigus Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-white text-lg tracking-wider font-semibold">
            FRIGUS
          </span>
        </div>

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
      <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full bg-frigus-ice flex items-center justify-center text-frigus-navy font-bold text-xs shrink-0">
          {user?.profilePictureUrl ? <img src={user.profilePictureUrl} alt="Foto do perfil" className="w-full h-full rounded-full object-cover" /> : initials}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white text-xs font-bold truncate">{user?.name || "Visitante"}</span>
          <span className="text-sidebar-muted text-[11px] truncate">{user ? { DOMESTIC: "Conta doméstica", COMMERCIAL: "Conta comercial", BUSINESS: "Conta empresarial" }[user.accountType] : ""}</span>
        </div>
        <button type="button" title="Sair" aria-label="Sair da conta" onClick={async()=>{try{await logout();}finally{useStore.getState().logout();navigate("/login",{replace:true});}}} className="ml-auto rounded-lg p-2 text-sidebar-muted hover:bg-white/10 hover:text-white"><LogOut size={17}/></button>
      </div>
    </aside>
  );
}
