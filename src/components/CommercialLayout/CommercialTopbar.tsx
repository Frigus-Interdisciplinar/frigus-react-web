import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, Bell, ArrowLeftRight } from "lucide-react";
import { CommercialNotificationsModal } from "@/components/CommercialModals";
import ThemeToggle from "@/components/ThemeToggle";

interface CommercialTopbarProps {
  breadcrumb?: string;
  action?: ReactNode;
}

export default function CommercialTopbar({
  breadcrumb = "Área comercial    /    Estoque",
}: CommercialTopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white dark:bg-[#1C1E22] border-b border-[#e1e7f0] dark:border-[#343941] px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-[#64748b] dark:text-neutral-400 font-medium tracking-wide">
          <span>{breadcrumb}</span>
        </div>

        {/* Right Actions: Date, Notification Bell, ThemeToggle, User Avatar, Profile Switcher */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/choose-profile"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-[11px] font-bold text-frigus-primary dark:text-blue-400 hover:bg-blue-100 transition-colors"
            title="Alternar entre perfis"
          >
            <ArrowLeftRight size={12} />
            <span>Comercial</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#64748b] dark:text-neutral-400 font-medium bg-gray-50/80 dark:bg-[#252A32] border border-gray-200/60 dark:border-[#343941] px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-[#64748b] dark:text-neutral-400" />
            <span>06 set 2026</span>
          </div>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notificações da operação"
            className="relative w-9 h-9 rounded-lg border border-gray-200/80 dark:border-[#343941] flex items-center justify-center text-[#141C55] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-[#252A32] hover:border-[#2552C8]/50 transition-colors cursor-pointer"
          >
            <Bell size={16} className="text-[#141C55] dark:text-neutral-200" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#1C1E22]" />
          </button>

          <div
            className="w-9 h-9 rounded-lg bg-[#EAF1FF] dark:bg-[#252A32] border border-blue-100 dark:border-[#343941] flex items-center justify-center text-[#131C55] dark:text-blue-300 font-bold text-xs shadow-xs"
            title="Ana Souza (Gerente)"
          >
            AS
          </div>
        </div>
      </header>

      {/* Modal de Notificações da Operação (Figma 1879:2402) */}
      <CommercialNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
