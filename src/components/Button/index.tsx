import { type ComponentProps } from "react";
import { cn } from "@/utils/cn.util";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "discrete"
  | "accent"
  | "destructive"
  | "outline";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex items-center justify-center font-sans font-medium rounded-lg px-4 py-2.5 text-sm cursor-pointer select-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-frigus-primary/30";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-frigus-primary text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm font-semibold disabled:bg-[#E8EEFF] disabled:text-[#596B85] dark:disabled:bg-[#282E3C] dark:disabled:text-[#ADB6C8]",
  secondary:
    "bg-white border border-[#C9DEF9] text-frigus-primary hover:bg-[#EAF1FF] active:scale-[0.98] font-semibold dark:bg-[#1C1E22] dark:border-[#343941] dark:text-[#A7BCFF] dark:hover:bg-[#252A32]",
  discrete:
    "bg-transparent text-frigus-primary hover:bg-[#EAF1FF]/60 active:scale-[0.98] font-semibold dark:text-[#A7BCFF] dark:hover:bg-[#232D42]/60",
  accent:
    "bg-frigus-accent text-frigus-navy font-bold hover:bg-[#eab950] active:scale-[0.98] shadow-sm",
  destructive:
    "bg-[#FCECF0] text-[#A92C49] hover:bg-[#fad5dd] active:scale-[0.98] font-semibold dark:bg-[#442B36] dark:text-[#FFB4C4] dark:hover:bg-[#523441]",
  outline:
    "border border-[#E1E7F0] bg-transparent text-[#1B2C62] hover:bg-gray-50 active:scale-[0.98] dark:border-[#343941] dark:text-gray-200 dark:hover:bg-[#252A32]",
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
