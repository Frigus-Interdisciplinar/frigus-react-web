import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import QuickNotificationsPopover from "./QuickNotificationsPopover";

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
    <header className="h-20 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Lado Esquerdo: Título ou Contexto */}
      <div className="flex flex-col">
        {title && (
          <h2 className="font-montserrat font-bold text-frigus-navy text-lg leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 font-sans">{subtitle}</p>
        )}
      </div>

      {/* Lado Direito: Ações rápidas */}
      <div className="flex items-center gap-3 relative">
        {/* Botão Notificações Rápidas (Abre popover do Figma 1879:4750) */}
        <button
          type="button"
          onClick={() => setIsQuickNotificationsOpen((prev) => !prev)}
          aria-label="Notificações rápidas"
          aria-expanded={isQuickNotificationsOpen}
          className="relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-frigus-navy hover:bg-gray-50 hover:border-frigus-light-blue transition-all cursor-pointer"
        >
          <Bell size={18} className="text-frigus-navy" />
          {hasNotificationAlert && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-frigus-accent ring-2 ring-white" />
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
          className="w-10 h-10 rounded-full bg-[#EAF3FF] border border-blue-100 flex items-center justify-center text-frigus-primary hover:ring-2 hover:ring-frigus-primary/20 transition-all font-bold text-xs"
        >
          <User size={18} className="text-frigus-primary" />
        </Link>
      </div>
    </header>
  );
}

export { QuickNotificationsPopover };
