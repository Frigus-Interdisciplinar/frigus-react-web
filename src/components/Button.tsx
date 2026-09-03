


import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn.util';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

const baseClasses =
  'inline-flex items-center justify-center font-sans font-medium rounded-button px-5 py-2.5 text-sm cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-frigus-primary/30';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-frigus-primary text-frigus-white hover:bg-frigus-secondary active:scale-[0.98] shadow-sm font-semibold',
  secondary: 'bg-frigus-ice text-frigus-navy hover:bg-frigus-light-blue/40 active:scale-[0.98]',
  accent: 'bg-frigus-accent text-frigus-navy font-bold hover:bg-frigus-accent/90 active:scale-[0.98] shadow-sm',
  destructive: 'bg-[#DA5B68] text-frigus-white hover:bg-[#DA5B68]/90 active:scale-[0.98] shadow-sm',
  outline: 'border border-border-subtle bg-transparent text-text-main hover:bg-surface active:scale-[0.98]',
};

export default function Button({
  children,
  className,
  variant = 'primary',
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