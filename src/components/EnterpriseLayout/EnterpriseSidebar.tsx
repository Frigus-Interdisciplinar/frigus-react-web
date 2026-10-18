import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Megaphone,
  Eye,
  FileBarChart2,
  UsersRound,
} from "lucide-react";
import FrigusLogo from "@/assets/frigus-logo-text.svg";
import { useStore } from "@/store/store";

interface EnterpriseSidebarProps {
  activeSection?: "overview" | "ads" | "report" | "views" | "audience";
}

export default function EnterpriseSidebar({
  activeSection = "overview",
}: EnterpriseSidebarProps) {
  const location = useLocation();
  const user = useStore((state) => state.user);

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
      icon: FileBarChart2,
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
      icon: UsersRound,
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
    <aside className="flex min-h-screen w-[232px] shrink-0 flex-col justify-between border-r border-[#E1E7F0] bg-white transition-colors dark:border-white/5 dark:bg-[#171819]">
      <div className="px-3 pt-5">
        {/* Logo */}
        <div className="mb-[54px] flex items-center gap-2 px-1">
          <img src={FrigusLogo} alt="Frigus" className="h-7 w-auto" />
        </div>

        {/* Navigation */}
        <nav aria-label="Navegação empresarial" className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex h-[42px] items-center gap-3 rounded-[6px] px-3 text-xs font-semibold transition-all ${
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
      <div className="border-t border-[#E1E7F0] px-3 py-3 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2552C8] text-white font-bold text-xs flex items-center justify-center shrink-0">
            RA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#141C55] dark:text-white truncate">
              {user?.name ?? "Conta empresarial"}
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-neutral-400 truncate">
              {user?.email ?? "Anunciante"}
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
}
