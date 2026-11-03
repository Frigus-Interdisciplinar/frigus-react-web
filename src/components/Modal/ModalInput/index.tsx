import { Search } from "lucide-react";
import { useId } from "react";
import { cn } from "@/utils/cn.util";
import type { ModalInputProps } from "@/types/modal-component-props.type";
export type { ModalInputProps } from "@/types/modal-component-props.type";

export default function ModalInput({
  icon,
  className,
  id,
  placeholder = "Buscar...",
  ...props
}: ModalInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const label = props["aria-label"] ?? placeholder;
  return (
    <div className="px-6 pt-4">
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none">
          {icon ?? <Search size={18} />}
        </span>
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          aria-label={label}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#252A32] text-sm text-slate-800 dark:text-white focus:outline-hidden focus:border-frigus-primary dark:focus:border-[#5B89F7] focus:ring-2 focus:ring-frigus-primary/10 transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
