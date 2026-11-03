import type { ReactNode } from "react";
import type { AccountType } from "@/types/auth.type";

export type AuthGuardProps = {
  children: ReactNode;
  accountType?: AccountType;
  allowPlanSelection?: boolean;
};
export type AuthLayoutProps = {
  title: ReactNode;
  description: ReactNode;
  cardTitle: string;
  cardDescription: ReactNode;
  children: ReactNode;
};
export type AuthSidebarProps = Omit<AuthLayoutProps, "children">;
export type AuthBenefitCardProps = {
  cardTitle: string;
  cardDescription: ReactNode;
};
