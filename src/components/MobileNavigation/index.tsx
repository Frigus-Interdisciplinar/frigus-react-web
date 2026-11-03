import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useModalFocus } from "@/hooks/useModalFocus";
import type { MobileNavigationProps } from "@/types/layout-component-props.type";
export type { MobileNavigationItem, MobileNavigationProps } from "@/types/layout-component-props.type";

export default function MobileNavigation({
  label,
  items,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dialogRef = useModalFocus(open, () => setOpen(false));

  return (
    <>
      <button
        type="button"
        aria-label="Abrir navegação"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E1E7F0] bg-white text-[#141C55] hover:bg-[#F5F8FC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2552C8] dark:border-[#343941] dark:bg-[#1C1E22] dark:text-white dark:hover:bg-[#252A32] lg:hidden"
      >
        <Menu size={19} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Fechar navegação"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/50"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className="relative flex h-full w-[min(20rem,calc(100vw-2.5rem))] flex-col bg-[#131C55] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-white shadow-2xl dark:bg-[#171819]"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <BrandLogo surface="dark" className="h-7 w-auto" />
              <button
                type="button"
                aria-label="Fechar navegação"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label={label} className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {items.map(({ label: itemLabel, href, icon: Icon }) => {
                  const active =
                    location.pathname === href ||
                    (href !== "/home" &&
                      href !== "/enterprise" &&
                      href !== "/commercial/stock" &&
                      location.pathname.startsWith(`${href}/`));
                  return (
                    <li key={href}>
                      <Link
                        to={href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? "bg-[#2552C8] text-white" : "text-[#C9DEF9] hover:bg-white/10 hover:text-white"}`}
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span>{itemLabel}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
