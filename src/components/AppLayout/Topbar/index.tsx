import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import QuickNotificationsPopover from "./QuickNotificationsPopover";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/store/store";
import type { SectionString } from "../Sidebar";

export type TopbarProps = {
  title?: string;
  subtitle?: string;
  hasNotificationAlert?: boolean;
  activeSection?: SectionString;
};

export default function Topbar({
  title,
  subtitle,
  hasNotificationAlert = true,
  activeSection,
}: TopbarProps) {
  const [isQuickNotificationsOpen, setIsQuickNotificationsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const initials = user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "";
  const sectionLabels: Partial<Record<NonNullable<SectionString>, string>> = {
    home: "Visão geral", stock: "Meu estoque", recipe: "Receitas", "shopping-list": "Compras",
    "family-members": "Família", chat: "Chat", settings: "Configurações", alerts: "Alertas",
    profile: "Perfil", plans: "Planos", notifications: "Notificações",
  };

  // Fechar ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsQuickNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-20 bg-white dark:bg-[#1B1D20] border-b border-gray-200/80 dark:border-[#2A2D31] px-6 md:px-9 flex items-center justify-between sticky top-0 z-30 select-none transition-colors">
      {/* Lado Esquerdo: Título ou Contexto */}
      <div className="flex flex-col gap-0.5 text-[11px] text-[#64748B] dark:text-neutral-400">
        <p><span>Área doméstica</span><span className="mx-2">/</span><span>{title ?? sectionLabels[activeSection as NonNullable<SectionString>] ?? "Frigus"}</span></p>
        {subtitle && <p className="text-[10px]">{subtitle}</p>}
      </div>

      {/* Lado Direito: Ações rápidas */}
      <div className="flex items-center gap-3 relative">
        {/* ThemeToggle */}
        <ThemeToggle />

        {/* Botão Notificações Rápidas */}
        <button
          type="button"
          onClick={() => setIsQuickNotificationsOpen((prev) => !prev)}
          aria-label="Notificações rápidas"
          aria-expanded={isQuickNotificationsOpen}
          className="relative w-10 h-10 rounded-full bg-white dark:bg-[#1C1E22] border border-gray-200 dark:border-[#343941] flex items-center justify-center text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] hover:border-frigus-light-blue transition-all cursor-pointer shadow-xs"
        >
          <Bell size={18} className="text-frigus-navy dark:text-neutral-200" />
          {hasNotificationAlert && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-frigus-accent ring-2 ring-white dark:ring-[#1C1E22]" />
          )}
        </button>

        {/* Popover flutuante de notificações rápidas */}
        <QuickNotificationsPopover
          isOpen={isQuickNotificationsOpen}
          onClose={() => setIsQuickNotificationsOpen(false)}
        />

        {/* Botão Perfil */}
        <Link
          to="/profile"
          aria-label="Meu perfil"
          className="w-9 h-9 rounded-full bg-[#EAF3FF] dark:bg-[#252A32] border border-blue-100 dark:border-[#343941] flex items-center justify-center text-frigus-primary dark:text-[#A7BCFF] hover:ring-2 hover:ring-frigus-primary/20 transition-all font-bold text-xs"
        >
          {initials || <User size={16} className="text-frigus-primary dark:text-[#A7BCFF]" />}
        </Link>
      </div>
    </header>
  );
}

export { QuickNotificationsPopover };
