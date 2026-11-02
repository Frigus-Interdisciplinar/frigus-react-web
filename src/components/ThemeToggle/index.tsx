import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className={`relative inline-flex min-h-11 items-center h-11 w-[76px] shrink-0 cursor-pointer rounded-xl transition-colors duration-200 ease-in-out p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-frigus-primary ${
        isDark
          ? "bg-[#232D42] border border-[#343941]"
          : "bg-[#EAF1FF] border border-[#C9DEF9]"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex items-center justify-center h-10 w-[34px] transform rounded-[10px] shadow-sm transition duration-200 ease-in-out ${
          isDark
            ? "translate-x-[38px] bg-[#131C55] text-amber-300"
            : "translate-x-0.5 bg-white text-amber-500"
        }`}
      >
        {isDark ? (
          <Moon className="size-4 text-[#A7BCFF]" />
        ) : (
          <Sun className="size-4 text-amber-500" />
        )}
      </span>

      <span className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none text-xs">
        <Sun
          className={`size-3.5 transition-opacity ${!isDark ? "opacity-0" : "text-[#70809F] opacity-70"}`}
        />
        <Moon
          className={`size-3.5 transition-opacity ${isDark ? "opacity-0" : "text-[#70809F] opacity-70"}`}
        />
      </span>
    </button>
  );
}
