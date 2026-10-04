import { Link, useLocation } from "react-router-dom";
import {
  Package,
  CalendarClock,
  ShoppingBag,
  FileBarChart2,
  Trash2,
  DollarSign,
  Users,
} from "lucide-react";
import frigusLogo from "@/assets/frigus-logo.svg";

export type CommercialSection =
  | "stock"
  | "validity"
  | "shopping-list"
  | "monthly-report"
  | "waste"
  | "expenses"
  | "employees";

interface NavItem {
  label: string;
  href: string;
  icon: typeof Package;
  section: CommercialSection;
}

const operationItems: NavItem[] = [
  {
    label: "Estoque",
    href: "/commercial/stock",
    icon: Package,
    section: "stock",
  },
  {
    label: "Validades",
    href: "/commercial/validity",
    icon: CalendarClock,
    section: "validity",
  },
  {
    label: "Lista de compras",
    href: "/commercial/shopping-list",
    icon: ShoppingBag,
    section: "shopping-list",
  },
];

const analysisItems: NavItem[] = [
  {
    label: "Relatório mensal",
    href: "/commercial/monthly-report",
    icon: FileBarChart2,
    section: "monthly-report",
  },
  {
    label: "Desperdícios",
    href: "/commercial/waste",
    icon: Trash2,
    section: "waste",
  },
  {
    label: "Gastos e compras",
    href: "/commercial/expenses",
    icon: DollarSign,
    section: "expenses",
  },
];

const teamItems: NavItem[] = [
  {
    label: "Funcionários",
    href: "/commercial/employees",
    icon: Users,
    section: "employees",
  },
];

interface CommercialSidebarProps {
  activeSection?: CommercialSection;
}

export default function CommercialSidebar({ activeSection }: CommercialSidebarProps) {
  const location = useLocation();

  const isCurrentActive = (item: NavItem) => {
    if (activeSection) return activeSection === item.section;
    return location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-wider text-[#7e97b8] uppercase px-3 py-1.5">
        {title}
      </span>
      {items.map((item) => {
        const active = isCurrentActive(item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              active
                ? "bg-[#2552C8] text-white shadow-xs"
                : "text-[#c9def9] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={16} className={active ? "text-white" : "text-[#70A2D7]"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="h-screen sticky top-0 bg-[#131C55] dark:bg-[#0B1020] dark:border-r dark:border-white/5 w-64 p-4 flex flex-col justify-between shrink-0 select-none z-20 overflow-y-auto">
      <div className="flex flex-col gap-5">
        {/* Brand / Logo */}
        <div className="flex flex-col gap-1 px-3 pt-2">
          <Link to="/commercial/stock" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={frigusLogo} alt="Frigus Logo" className="w-8 h-8 object-contain" />
            <div className="flex flex-col">
              <span className="font-display text-white text-lg tracking-wider font-semibold leading-none">
                FRIGUS
              </span>
              <span className="text-[9px] font-bold tracking-widest text-[#70A2D7] uppercase mt-0.5">
                ESPAÇO COMERCIAL
              </span>
            </div>
          </Link>
        </div>

        {/* Business Box */}
        <div className="bg-[#1b266b]/60 dark:bg-white/5 border border-[#2a388a]/50 dark:border-white/10 rounded-xl p-3 mx-1 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-bold truncate">Sabor & Cia</span>
            <span className="text-[#8fa9cf] text-[11px] truncate">Unidade Centro</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Unidade ativa" />
        </div>

        {/* Navigation Sections */}
        <nav className="flex flex-col gap-4">
          {renderNavGroup("OPERAÇÃO", operationItems)}
          {renderNavGroup("ANÁLISE", analysisItems)}
          {renderNavGroup("EQUIPE", teamItems)}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between px-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#EAF1FF] flex items-center justify-center text-[#131C55] font-bold text-xs shrink-0 shadow-xs">
            AS
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white text-xs font-bold truncate">Ana Souza</span>
            <span className="text-[#8fa9cf] text-[11px] truncate">Gerente</span>
          </div>
        </div>

        <Link
          to="/choose-profile"
          className="text-[10px] text-[#70A2D7] hover:text-white transition-colors"
          title="Trocar perfil"
        >
          Trocar
        </Link>
      </div>
    </aside>
  );
}
