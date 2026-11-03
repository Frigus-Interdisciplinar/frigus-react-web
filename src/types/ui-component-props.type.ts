import type { ComponentProps, CSSProperties, ReactNode } from "react";

export type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
};
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
export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  id: string;
  label: ReactNode;
};
export type BrandLogoProps = {
  surface: "light" | "dark" | "theme";
  className?: string;
};
export type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};
export type SkeletonProps = {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  circle?: boolean;
};
export type SkeletonRowsProps = {
  rows?: number;
  className?: string;
  rowClassName?: string;
};
export type SkeletonCardProps = {
  children: ReactNode;
  className?: string;
};
export type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (idToken: string) => void;
  onError: (message: string) => void;
};
export type ThemeToggleProps = {
  className?: string;
};
