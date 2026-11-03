import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Utensils,
  ShoppingBasket,
  UsersRound,
  MessageCircle,
  Sparkles,
  Settings,
} from "lucide-react";
import NavigationItem from "./NavigationItem";
import BrandLogo from "@/components/BrandLogo";

import type { NavItem, SidebarProps } from "@/types/layout-component-props.type";
export type { NavItem, SectionString, SidebarProps } from "@/types/layout-component-props.type";

const navigationItems: NavItem[] = [
  {
    label: "Visão geral",
    href: "/home",
    icon: <LayoutDashboard size={18} />,
    section: "home",
  },
  {
    label: "Meu estoque",
    href: "/stock",
    icon: <Package size={18} />,
    section: "stock",
  },
  {
    label: "Receitas",
    href: "/recipe",
    icon: <Utensils size={18} />,
    section: "recipe",
  },
  {
    label: "Compras",
    href: "/shopping-list",
    icon: <ShoppingBasket size={18} />,
    section: "shopping-list",
  },
  {
    label: "Família",
    href: "/family-members",
    icon: <UsersRound size={18} />,
    section: "family-members",
  },
  {
    label: "Chat",
    href: "/chat",
    icon: <MessageCircle size={18} />,
    section: "chat",
  },
  {
    label: "Chat IA",
    href: "/chat-ai",
    icon: <Sparkles size={18} />,
    section: "chat-ai",
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: <Settings size={18} />,
    section: "settings",
  },
];

export default function Sidebar({
  activeSection,
  userName,
  planLabel,
}: SidebarProps) {
  const initials =
    userName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "—";
  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-[232px] shrink-0 select-none flex-col justify-between border-r border-transparent bg-sidebar-bg p-3 text-white transition-colors dark:border-white/5 dark:bg-[#171819] lg:flex">
      <div className="flex flex-col gap-6">
        <Link
          to="/home"
          className="flex items-center gap-2.5 px-1 pt-2 hover:opacity-90 transition-opacity"
        >
          <BrandLogo surface="dark" className="h-7 w-auto" />
        </Link>

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

      <Link
        to="/profile"
        className="pt-4 border-t border-white/10 flex items-center gap-3 px-2 hover:bg-white/5 rounded-lg transition-colors py-2"
      >
        <div className="w-9 h-9 rounded-full bg-frigus-ice flex items-center justify-center text-frigus-navy font-bold text-xs shrink-0">
          {initials}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white text-xs font-bold truncate">
            {userName || "Minha conta"}
          </span>
          <span className="text-sidebar-muted text-[11px] truncate">
            {planLabel}
          </span>
        </div>
      </Link>
    </aside>
  );
}
