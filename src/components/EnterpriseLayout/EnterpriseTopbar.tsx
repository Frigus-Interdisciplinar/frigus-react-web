import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useStore } from "@/store/store";

interface EnterpriseTopbarProps {
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
}

export default function EnterpriseTopbar({
  breadcrumb = "Área empresarial / Visão geral",
}: EnterpriseTopbarProps) {
  const user = useStore((state) => state.user);
  const initials = user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "";
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E1E7F0] bg-white px-6 transition-colors dark:border-[#2A2D31] dark:bg-[#1B1D20] md:px-9">
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
          <span>{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <Link to="/profile" aria-label="Meu perfil empresarial" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#2552C8] dark:bg-[#252A32] dark:text-blue-300">
            {initials}
          </Link>
        </div>
      </div>
    </header>
  );
}
