import { type ComponentProps, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn.util";

export type ModalInputProps = ComponentProps<"input"> & {
  icon?: ReactNode;
};

export default function ModalInput({
  icon,
  className,
  placeholder = "Buscar...",
  ...props
}: ModalInputProps) {
  return (
    <div className="px-6 pt-4">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon ?? <Search size={18} />}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-frigus-primary focus:ring-2 focus:ring-frigus-primary/10 transition-all placeholder:text-gray-400",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
}
