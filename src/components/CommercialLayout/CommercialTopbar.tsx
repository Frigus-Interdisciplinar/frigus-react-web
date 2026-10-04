import { useState, type ReactNode } from "react";
import { Calendar, Bell } from "lucide-react";
import { CommercialNotificationsModal } from "@/components/CommercialModals";

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
      <header className="h-16 bg-white border-b border-[#e1e7f0] px-8 flex items-center justify-between sticky top-0 z-30 select-none">
        {/* Breadcrumb */}
        <div className="flex items-center text-xs text-[#64748b] font-medium tracking-wide">
          <span>{breadcrumb}</span>
        </div>

        {/* Right Actions: Date, Notification Bell, User Avatar */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs text-[#64748b] font-medium bg-gray-50/80 border border-gray-200/60 px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-[#64748b]" />
            <span>06 set 2026</span>
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notificações da operação"
            className="relative w-9 h-9 rounded-lg border border-gray-200/80 flex items-center justify-center text-[#141C55] hover:bg-gray-50 hover:border-[#2552C8]/50 transition-colors cursor-pointer"
          >
            <Bell size={16} className="text-[#141C55]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          <div
            className="w-9 h-9 rounded-lg bg-[#EAF1FF] border border-blue-100 flex items-center justify-center text-[#131C55] font-bold text-xs shadow-xs"
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
