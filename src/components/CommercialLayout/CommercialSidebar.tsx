import { Link, useLocation } from "react-router-dom";
import { Package, CalendarClock, ShoppingBag, FileBarChart2, Trash2, DollarSign, Users } from "lucide-react";
import frigusLogo from "@/assets/frigus-logo.svg";
import { useStore } from "@/store/store";

export type CommercialSection = "stock" | "validity" | "shopping-list" | "monthly-report" | "waste" | "expenses" | "employees";

const navItems = [
  { label: "Estoque", href: "/commercial/stock", icon: Package, section: "stock" },
  { label: "Validades", href: "/commercial/validity", icon: CalendarClock, section: "validity" },
  { label: "Lista de compras", href: "/commercial/shopping-list", icon: ShoppingBag, section: "shopping-list" },
  { label: "Relatório mensal", href: "/commercial/monthly-report", icon: FileBarChart2, section: "monthly-report" },
  { label: "Desperdícios", href: "/commercial/waste", icon: Trash2, section: "waste" },
  { label: "Gastos e compras", href: "/commercial/expenses", icon: DollarSign, section: "expenses" },
  { label: "Funcionários", href: "/commercial/employees", icon: Users, section: "employees" },
] as const;

interface CommercialSidebarProps { activeSection?: CommercialSection }

export default function CommercialSidebar({ activeSection }: CommercialSidebarProps) {
  const location = useLocation();
  const user = useStore((state) => state.user);
  const initials = user?.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "AS";

  return (
    <aside className="sticky top-0 z-20 flex h-screen w-[232px] shrink-0 select-none flex-col justify-between overflow-y-auto bg-[#131C55] p-3 text-white transition-colors dark:border-r dark:border-white/5 dark:bg-[#171819]">
      <div>
        <Link to="/commercial/stock" className="flex items-center gap-2.5 px-1 pt-2 hover:opacity-90">
          <img src={frigusLogo} alt="" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg font-semibold">Frigus</span>
        </Link>
        <nav aria-label="Navegação comercial" className="mt-[54px] flex flex-col gap-2">
          {navItems.map(({ label, href, icon: Icon, section }) => {
            const active = activeSection ? activeSection === section : location.pathname === href || location.pathname.startsWith(`${href}/`);
            return (
              <Link key={href} to={href} aria-current={active ? "page" : undefined} className={`flex h-[42px] items-center gap-3 rounded-[6px] px-3 text-xs font-semibold transition-colors ${active ? "bg-[#2552C8] text-white" : "text-[#C9DEF9] hover:bg-white/5 hover:text-white"}`}>
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <Link to="/profile" className="flex items-center gap-3 border-t border-white/15 px-1 py-3 hover:bg-white/5">
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#131C55]">{initials}</span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xs font-bold">{user?.name ?? "Ana Souza"}</span>
          <span className="truncate text-[11px] text-[#C9DEF9]">Gerente</span>
        </span>
      </Link>
    </aside>
  );
}
