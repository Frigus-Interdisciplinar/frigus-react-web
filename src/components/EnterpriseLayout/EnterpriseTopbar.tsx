import { Calendar, Plus } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface EnterpriseTopbarProps {
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
}

export default function EnterpriseTopbar({
  breadcrumb = "Área empresarial / Visão geral",
  onOpenCreateAd,
}: EnterpriseTopbarProps) {
  return (
    <header className="h-20 bg-white/80 dark:bg-[#0B1020]/80 backdrop-blur-md border-b border-[#E1E7F0] dark:border-white/5 px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Breadcrumb */}
      <div>
        <p className="text-xs font-semibold text-[#64748B] dark:text-neutral-400">
          {breadcrumb}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Date pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F8FC] dark:bg-[#1C1E22] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#64748B] dark:text-neutral-300">
          <Calendar size={14} className="text-[#2552C8] dark:text-blue-400" />
          <span>Quarta-feira, 26 de agosto</span>
        </div>

        {/* Action: Criar anúncio */}
        {onOpenCreateAd && (
          <button
            type="button"
            onClick={onOpenCreateAd}
            className="hidden sm:inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Criar anúncio</span>
          </button>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#E1E7F0] dark:border-[#343941]">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#2552C8] to-blue-400 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            RA
          </div>
        </div>
      </div>
    </header>
  );
}
