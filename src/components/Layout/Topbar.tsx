import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

type TopbarProps = {
  title?: string;
  subtitle?: string;
  hasNotificationAlert?: boolean;
};

export default function Topbar({
  title,
  subtitle,
  hasNotificationAlert = true,
}: TopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-200/80 px-8 flex items-center justify-between sticky top-0 z-10 select-none">
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
      <div className="flex items-center gap-3">
        {/* Botão Notificações */}
        <Link
          to="/notifications"
          aria-label="Notificações"
          className="relative w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-frigus-navy hover:bg-gray-50 hover:border-frigus-light-blue transition-all"
        >
          <Bell size={18} className="text-frigus-navy" />
          {hasNotificationAlert && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-frigus-accent ring-2 ring-white" />
          )}
        </Link>

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
