import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  DollarSign,
  FileBarChart2,
  LogOut,
  Package,
  ShoppingBag,
  Trash2,
  Users,
} from "lucide-react";
import { CommercialNotificationsModal } from "@/components/CommercialModals";
import ThemeToggle from "@/components/ThemeToggle";

import MobileNavigation from "@/components/MobileNavigation";
import type { CommercialTopbarProps } from "@/types/layout-component-props.type";
export type { CommercialTopbarProps } from "@/types/layout-component-props.type";

const mobileNavigationItems = [
  { label: "Estoque", href: "/commercial/stock", icon: Package },
  { label: "Validades", href: "/commercial/validity", icon: CalendarClock },
  { label: "Lista de compras", href: "/commercial/shopping-list", icon: ShoppingBag },
  { label: "Relatório mensal", href: "/commercial/monthly-report", icon: FileBarChart2 },
  { label: "Desperdícios", href: "/commercial/waste", icon: Trash2 },
  { label: "Gastos e compras", href: "/commercial/expenses", icon: DollarSign },
  { label: "Funcionários", href: "/commercial/employees", icon: Users },
];

export default function CommercialTopbar({
  breadcrumb = "Área comercial    /    Estoque",
  userName,
  onLogout,
}: CommercialTopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const initials =
    userName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
        if (accountMenuRef.current?.contains(document.activeElement)) {
          accountButtonRef.current?.focus();
        }
      }
    };
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 select-none items-center justify-between gap-2 border-b border-[#E1E7F0] bg-white px-3 py-2 transition-colors dark:border-[#2A2D31] dark:bg-[#1B1D20] sm:min-h-20 sm:gap-4 sm:px-6 md:px-9">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          <MobileNavigation label="Navegação comercial" items={mobileNavigationItems} />
          <p className="truncate text-[11px] font-medium text-[#64748B] dark:text-neutral-400">
          {breadcrumb}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notificações da operação"
            aria-expanded={isNotificationsOpen}
            aria-haspopup="dialog"
            aria-controls="commercial-modal-dialog"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E7F0] text-[#141C55] hover:bg-[#F5F8FC] dark:border-[#343941] dark:text-neutral-200 dark:hover:bg-[#252A32]"
          >
            <Bell size={16} aria-hidden="true" />
          </button>
          <div className="relative" ref={accountMenuRef}>
            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              aria-label="Menu da conta"
              aria-expanded={isAccountMenuOpen}
              aria-controls={isAccountMenuOpen ? "account-menu" : undefined}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#131C55] transition-all hover:ring-2 hover:ring-[#2552C8]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2552C8] dark:bg-[#252A32] dark:text-blue-300"
            >
              {initials || userName[0]?.toUpperCase() || "—"}
            </button>
            {isAccountMenuOpen && (
              <div
                id="account-menu"
                className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-[#343941] dark:bg-[#1C1E22]"
              >
                <Link
                  to="/profile"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#141C55] hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-[#2552C8] dark:text-white dark:hover:bg-[#252A32]"
                >
                  Minha conta
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600 dark:text-red-300 dark:hover:bg-red-950/30"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <CommercialNotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
