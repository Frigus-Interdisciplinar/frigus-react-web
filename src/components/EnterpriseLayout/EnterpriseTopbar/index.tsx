import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Eye,
  FileBarChart2,
  LayoutGrid,
  LogOut,
  Megaphone,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { CommercialNotificationsModal } from "@/components/CommercialModals";
import { useStore } from "@/store/store";
import { logout as endSession } from "@/services/auth.service";
import MobileNavigation from "@/components/MobileNavigation";
import type { EnterpriseTopbarProps } from "@/types/component-props.type";
export type { EnterpriseTopbarProps } from "@/types/component-props.type";

const mobileNavigationItems = [
  { label: "Visão geral", href: "/enterprise", icon: LayoutGrid },
  { label: "Produtos anunciados", href: "/enterprise/ads", icon: Megaphone },
  { label: "Relatório mensal", href: "/enterprise/report", icon: FileBarChart2 },
  { label: "Visualizações", href: "/enterprise/views", icon: Eye },
  { label: "Público atingido", href: "/enterprise/audience", icon: UsersRound },
];

export default function EnterpriseTopbar({
  breadcrumb = "Área empresarial / Visão geral",
}: EnterpriseTopbarProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const user = useStore((state) => state.user);
  const clearSession = useStore((state) => state.logout);
  const navigate = useNavigate();
  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "";
  const handleLogout = () => {
    void endSession().catch(() => undefined);
    clearSession();
    navigate("/login", { replace: true });
  };

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
          <MobileNavigation label="Navegação empresarial" items={mobileNavigationItems} />
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
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-bold text-[#2552C8] transition-all hover:ring-2 hover:ring-[#2552C8]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2552C8] dark:bg-[#252A32] dark:text-blue-300"
            >
              {initials || user?.name?.[0]?.toUpperCase() || "—"}
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
                  onClick={handleLogout}
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
