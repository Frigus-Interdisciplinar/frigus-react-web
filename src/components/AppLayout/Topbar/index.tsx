import { useState, useEffect, useRef } from "react";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBasket,
  Sparkles,
  Settings,
  User,
  UsersRound,
  Utensils,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import QuickNotificationsPopover from "./QuickNotificationsPopover";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/store/store";

import type { SectionString, TopbarProps } from "@/types/component-props.type";
export type { TopbarProps } from "@/types/component-props.type";
import MobileNavigation from "@/components/MobileNavigation";
import { useServiceOperations } from "@/hooks/useServiceOperations";

const mobileNavigationItems = [
  { label: "Visão geral", href: "/home", icon: LayoutDashboard },
  { label: "Meu estoque", href: "/stock", icon: Package },
  { label: "Receitas", href: "/recipe", icon: Utensils },
  { label: "Compras", href: "/shopping-list", icon: ShoppingBasket },
  { label: "Família", href: "/family-members", icon: UsersRound },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Chat IA", href: "/chat-ai", icon: Sparkles },
  { label: "Configurações", href: "/settings", icon: Settings },
];

export default function Topbar({
  title,
  subtitle,
  hasNotificationAlert = true,
  activeSection,
}: TopbarProps) {
  const apiOperations = useServiceOperations();
  const [isQuickNotificationsOpen, setIsQuickNotificationsOpen] =
    useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuContentRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const clearSession = useStore((state) => state.logout);
  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "";
  const sectionLabels: Partial<Record<NonNullable<SectionString>, string>> = {
    home: "Visão geral",
    stock: "Meu estoque",
    recipe: "Receitas",
    "shopping-list": "Compras",
    "family-members": "Família",
    chat: "Chat",
    settings: "Configurações",
    alerts: "Alertas",
    profile: "Perfil",
    plans: "Planos",
    notifications: "Notificações",
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQuickNotificationsOpen(false);
        setIsAccountMenuOpen(false);
        if (accountMenuRef.current?.contains(document.activeElement)) {
          accountButtonRef.current?.focus();
        }
      }
    };
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    accountMenuContentRef.current
      ?.querySelector<HTMLElement>("a[href], button")
      ?.focus();
  }, [isAccountMenuOpen]);

  const handleLogout = () => {
    void apiOperations.auth.logout().catch(() => undefined);
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-2 border-b border-gray-200/80 bg-white px-3 py-2 text-[#64748B] transition-colors dark:border-[#2A2D31] dark:bg-[#1B1D20] sm:min-h-20 sm:gap-4 sm:px-6 md:px-9">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <MobileNavigation label="Navegação doméstica" items={mobileNavigationItems} />
        <div className="flex min-w-0 flex-col gap-0.5 text-[11px] dark:text-neutral-400">
        <p className="truncate">
          <span>Área doméstica</span>
          <span className="mx-2">/</span>
          <span>
            {title ??
              sectionLabels[activeSection as NonNullable<SectionString>] ??
              "Frigus"}
          </span>
        </p>
        {subtitle && <p className="truncate text-[10px]">{subtitle}</p>}
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-3">
        <ThemeToggle />

        <button
          type="button"
          onClick={() => setIsQuickNotificationsOpen((prev) => !prev)}
          aria-label="Notificações rápidas"
          aria-expanded={isQuickNotificationsOpen}
          aria-haspopup="dialog"
          aria-controls="quick-notifications-dialog"
          className="relative w-10 h-10 rounded-full bg-white dark:bg-[#1C1E22] border border-gray-200 dark:border-[#343941] flex items-center justify-center text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] hover:border-frigus-light-blue transition-all cursor-pointer shadow-xs"
        >
          <Bell size={18} className="text-frigus-navy dark:text-neutral-200" />
          {hasNotificationAlert && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-frigus-accent ring-2 ring-white dark:ring-[#1C1E22]" />
          )}
        </button>

        <QuickNotificationsPopover
          isOpen={isQuickNotificationsOpen}
          onClose={() => setIsQuickNotificationsOpen(false)}
        />

        <div className="relative" ref={accountMenuRef}>
          <button
            ref={accountButtonRef}
            type="button"
            onClick={() => {
              setIsAccountMenuOpen((open) => !open);
            }}
            aria-label="Menu da conta"
            aria-expanded={isAccountMenuOpen}
            aria-controls={isAccountMenuOpen ? "account-menu" : undefined}
            className="w-9 h-9 rounded-full bg-[#EAF3FF] dark:bg-[#252A32] border border-blue-100 dark:border-[#343941] flex items-center justify-center text-frigus-primary dark:text-[#A7BCFF] hover:ring-2 hover:ring-frigus-primary/20 transition-all font-bold text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frigus-primary"
          >
            {initials || (
              <User
                size={16}
                className="text-frigus-primary dark:text-[#A7BCFF]"
              />
            )}
          </button>
          {isAccountMenuOpen && (
            <div
              ref={accountMenuContentRef}
              id="account-menu"
              className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-[#343941] dark:bg-[#1C1E22]"
            >
              <Link
                to="/profile"
                onClick={() => setIsAccountMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-frigus-navy hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-frigus-primary dark:text-white dark:hover:bg-[#252A32]"
              >
                Meu perfil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-red-300 dark:hover:bg-red-950/30"
              >
                <LogOut size={16} aria-hidden="true" />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { QuickNotificationsPopover };
