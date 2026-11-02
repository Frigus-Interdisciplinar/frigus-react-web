import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Megaphone,
  Eye,
  FileBarChart2,
  UsersRound,
} from "lucide-react";
import frigusLogo from "@/assets/frigus-logo.svg";
import { useStore } from "@/store/store";

interface EnterpriseSidebarProps {
  activeSection?:
    | "overview"
    | "ads"
    | "report"
    | "views"
    | "audience"
    | "profile"
    | "settings"
    | "notifications";
}

export default function EnterpriseSidebar({
  activeSection = "overview",
}: EnterpriseSidebarProps) {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "—";

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
    <aside className="sticky top-0 z-20 flex h-screen w-[232px] shrink-0 select-none flex-col justify-between overflow-y-auto bg-[#131C55] p-3 text-white transition-colors dark:border-r dark:border-white/5 dark:bg-[#171819]">
      <div>
        <Link
          to="/enterprise"
          className="flex items-center gap-2.5 px-1 pt-2 hover:opacity-90"
        >
          <img src={frigusLogo} alt="" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg font-semibold">Frigus</span>
        </Link>

        <nav
          aria-label="Navegação empresarial"
          className="mt-[54px] flex flex-col gap-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-[42px] items-center gap-3 rounded-[6px] px-3 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#2552C8] text-white font-bold"
                    : "text-[#C9DEF9] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        to="/profile"
        className="flex items-center gap-3 border-t border-white/15 px-1 py-3 hover:bg-white/5"
      >
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#131C55]">
          {initials}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-bold">
            {user?.name ?? "Minha conta"}
          </span>
          <span className="truncate text-[11px] text-[#C9DEF9]">Anunciante</span>
        </span>
      </Link>
    </aside>
  );
}
