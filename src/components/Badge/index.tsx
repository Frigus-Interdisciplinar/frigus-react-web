import { type ReactNode } from "react";
import { cn } from "@/utils/cn.util";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "accent";

export type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  success:
    "bg-[#EAF7F0] text-[#10B981] border border-[#10B981]/20 dark:bg-[#133829] dark:text-[#34D399] dark:border-[#34D399]/30",
  warning:
    "bg-[#FFF9E6] text-[#D97706] border border-[#D97706]/20 dark:bg-[#382C10] dark:text-[#FBBF24] dark:border-[#FBBF24]/30",
  danger:
    "bg-[#FCECF0] text-[#A92C49] border border-[#A92C49]/20 dark:bg-[#442B36] dark:text-[#FFB4C4] dark:border-[#FFB4C4]/30",
  info:
    "bg-[#EAF1FF] text-[#2552C8] border border-[#2552C8]/20 dark:bg-[#1B2A4A] dark:text-[#A7BCFF] dark:border-[#A7BCFF]/30",
  neutral:
    "bg-[#F0F3F8] text-[#596B85] border border-[#596B85]/20 dark:bg-[#252E3E] dark:text-[#ADB6C8] dark:border-[#ADB6C8]/30",
  primary:
    "bg-[#2552C8]/10 text-[#2552C8] border border-[#2552C8]/20 font-semibold dark:bg-[#2552C8]/30 dark:text-[#A7BCFF] dark:border-[#2552C8]/50",
  accent:
    "bg-[#F9C968]/20 text-[#B45309] border border-[#F9C968]/40 font-semibold dark:bg-[#F9C968]/20 dark:text-[#FDE68A] dark:border-[#F9C968]/40",
};

export default function Badge({
  variant = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-none tracking-wide select-none",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
