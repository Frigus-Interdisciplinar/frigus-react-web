import { type ComponentProps, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn.util';

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label?: ReactNode;
};

export default function Checkbox({
  id,
  label,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 cursor-pointer select-none group"
    >
      <div className="relative flex items-center justify-center shrink-0 size-4">
        <input
          type="checkbox"
          id={id}
          className={cn(
            'peer size-4 appearance-none bg-white rounded-[5px] border border-slate-200',
            'checked:bg-frigus-primary checked:border-frigus-primary',
            'hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-frigus-primary/20',
            'transition-all duration-150 cursor-pointer m-0',
            className
          )}
          {...props}
        />
        <Check
          className="pointer-events-none absolute size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150 stroke-[3]"
          aria-hidden="true"
        />
      </div>
      {label && (
        <span className="text-[#70809F] text-sm leading-none group-hover:text-slate-600 transition-colors mt-[-3px]">
          {label}
        </span>
      )}
    </label>
  );
}
