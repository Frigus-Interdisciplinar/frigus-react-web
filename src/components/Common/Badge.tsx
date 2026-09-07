import React from "react";
import { cn } from "@/utils/cn.util";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "accent";

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#EAF7F0] text-[#2F9B6C] border border-[#2F9B6C]/20",
  warning: "bg-[#FFF9E6] text-[#D9822B] border border-[#D9822B]/20",
  danger: "bg-[#FDECEE] text-[#DA5B68] border border-[#DA5B68]/20",
  info: "bg-[#EAF3FF] text-[#1F5F97] border border-[#1F5F97]/20",
  neutral: "bg-[#F0F3F8] text-[#5F6B7C] border border-[#5F6B7C]/15",
  primary: "bg-[#2552C8]/10 text-[#2552C8] border border-[#2552C8]/20 font-semibold",
  accent: "bg-[#F9C968]/20 text-[#8F6405] border border-[#F9C968]/40 font-semibold",
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
