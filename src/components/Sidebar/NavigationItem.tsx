import { Link } from "react-router-dom";
import type { NavItem } from "./Navbar";
import { cn } from "@/utils/cn.util";

type NavItemProps = {
  item: NavItem;
  active: boolean;
};

export default function NavigationItem({ item, active }: NavItemProps) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2.5 rounded-button w-full font-sans text-sm transition-colors duration-150 select-none",
        active
          ? "bg-frigus-primary text-sidebar-text font-bold shadow-sm"
          : "bg-transparent text-sidebar-muted hover:bg-white/10 hover:text-white"
      )}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}