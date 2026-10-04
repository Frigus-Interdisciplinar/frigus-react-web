import { useState, useEffect } from "react";
import { Bell, User, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import QuickNotificationsPopover from "./QuickNotificationsPopover";
import ThemeToggle from "@/components/ThemeToggle";

export type TopbarProps = {
  title?: string;
  subtitle?: string;
  hasNotificationAlert?: boolean;
};

export default function Topbar({
  title,
  subtitle,
  hasNotificationAlert = true,
}: TopbarProps) {
  const [isQuickNotificationsOpen, setIsQuickNotificationsOpen] = useState(false);

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
    <header className="h-20 bg-white dark:bg-[#15181E] border-b border-gray-200/80 dark:border-[#262A33] px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none transition-colors">
      {/* Lado Esquerdo: Título ou Contexto */}
      <div className="flex flex-col">
        {title && (
          <h2 className="font-montserrat font-bold text-frigus-navy dark:text-white text-lg leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-neutral-400 font-sans">{subtitle}</p>
        )}
      </div>

      {/* Lado Direito: Ações rápidas */}
      <div className="flex items-center gap-3 relative">
        {/* Seletor de Perfil / Canal */}
        <Link
          to="/choose-profile"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#252A32] text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-[#2F3540] transition-colors"
          title="Alternar perfil"
        >
          <LayoutGrid size={14} className="text-frigus-primary dark:text-[#5B89F7]" />
          <span>Doméstico</span>
        </Link>

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
          className="w-10 h-10 rounded-full bg-[#EAF3FF] dark:bg-[#252A32] border border-blue-100 dark:border-[#343941] flex items-center justify-center text-frigus-primary dark:text-[#A7BCFF] hover:ring-2 hover:ring-frigus-primary/20 transition-all font-bold text-xs"
        >
          <User size={18} className="text-frigus-primary dark:text-[#A7BCFF]" />
        </Link>
      </div>
    </header>
  );
}

export { QuickNotificationsPopover };
