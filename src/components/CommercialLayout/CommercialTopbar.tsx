import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { CommercialNotificationsModal } from "@/components/CommercialModals";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/store/store";

interface CommercialTopbarProps { breadcrumb?: string }

export default function CommercialTopbar({ breadcrumb = "Área comercial    /    Estoque" }: CommercialTopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const initials = user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "AS";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 select-none items-center justify-between border-b border-[#E1E7F0] bg-white px-6 transition-colors dark:border-[#2A2D31] dark:bg-[#1B1D20] md:px-9">
        <p className="text-[11px] font-medium text-[#64748B] dark:text-neutral-400">{breadcrumb}</p>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button type="button" onClick={() => setIsNotificationsOpen(true)} aria-label="Notificações da operação" className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E7F0] text-[#141C55] hover:bg-[#F5F8FC] dark:border-[#343941] dark:text-neutral-200 dark:hover:bg-[#252A32]">
            <Bell size={16} aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#1B1D20]" />
          </button>
          <Link to="/profile" aria-label="Meu perfil" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#131C55] dark:bg-[#252A32] dark:text-blue-300">{initials}</Link>
        </div>
      </header>
      <CommercialNotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}
