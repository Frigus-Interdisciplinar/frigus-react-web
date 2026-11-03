import { X } from "lucide-react";
import ModalTitle from "../ModalTitle";
import { cn } from "@/utils/cn.util";
import type { ModalHeaderProps } from "@/types/component-props.type";
export type { ModalHeaderProps } from "@/types/component-props.type";

export default function ModalHeader({
  title,
  subtitle,
  onClose,
  className,
  children,
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "p-6 pb-4 flex items-start justify-between border-b border-gray-100 dark:border-[#343941]",
        className,
      )}
    >
      {children ? (
        children
      ) : title ? (
        <ModalTitle title={title} subtitle={subtitle} />
      ) : null}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="p-1.5 rounded-full text-gray-400 hover:text-frigus-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
