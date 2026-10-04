import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Megaphone,
  BarChart3,
  Eye,
  Target,
  ArrowLeftRight,
} from "lucide-react";
import FrigusLogo from "@/assets/frigus-logo-text.svg";

interface EnterpriseSidebarProps {
  activeSection?: "overview" | "ads" | "report" | "views" | "audience";
}

export default function EnterpriseSidebar({
  activeSection = "overview",
}: EnterpriseSidebarProps) {
  const location = useLocation();

  const navItems = [
    {
      id: "overview",
      label: "Visão geral",
      path: "/enterprise",
      icon: LayoutGrid,
    },
    {
      id: "ads",
      label: "Produtos anunciados",
      path: "/enterprise/ads",
      icon: Megaphone,
    },
    {
      id: "report",
      label: "Relatório mensal",
      path: "/enterprise/report",
      icon: BarChart3,
    },
    {
      id: "views",
      label: "Visualizações",
      path: "/enterprise/views",
      icon: Eye,
    },
    {
      id: "audience",
      label: "Público atingido",
      path: "/enterprise/audience",
      icon: Target,
    },
  ];

  const currentSection =
    activeSection ||
    (location.pathname.includes("/ads")
      ? "ads"
      : location.pathname.includes("/report")
      ? "report"
      : location.pathname.includes("/views")
      ? "views"
      : location.pathname.includes("/audience")
      ? "audience"
      : "overview");

  return (
    <aside className="w-64 bg-white dark:bg-[#0B1020] border-r border-[#E1E7F0] dark:border-white/5 flex flex-col justify-between shrink-0 min-h-screen transition-colors">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <img src={FrigusLogo} alt="Frigus Logo" className="h-8 w-auto" />
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Empresarial
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#2552C8] text-white shadow-xs font-bold"
                    : "text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white hover:bg-[#F5F8FC] dark:hover:bg-[#1C1E22]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Organization Profile & Switch */}
      <div className="p-4 border-t border-[#E1E7F0] dark:border-white/5 space-y-3">
        <div className="p-3 rounded-2xl bg-[#F5F8FC] dark:bg-[#1C1E22] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2552C8] text-white font-bold text-xs flex items-center justify-center shrink-0">
            RA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#141C55] dark:text-white truncate">
              Rede Aurora
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-neutral-400 truncate">
              CNPJ 12.345.678/0001-90
            </p>
          </div>
        </div>

        <Link
          to="/choose-profile"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-[#E1E7F0] dark:border-[#343941] text-[11px] font-semibold text-[#64748B] dark:text-neutral-300 hover:text-[#141C55] dark:hover:text-white hover:bg-white dark:hover:bg-[#252A32] transition-colors"
        >
          <ArrowLeftRight size={14} />
          <span>Trocar de perfil</span>
        </Link>
      </div>
    </aside>
  );
}
