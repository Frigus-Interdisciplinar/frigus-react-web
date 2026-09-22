import { type ReactNode } from "react";
import { X } from "lucide-react";
import ModalTitle from "./ModalTitle";
import { cn } from "@/utils/cn.util";

export type ModalHeaderProps = {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  className?: string;
  children?: ReactNode;
};

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
        "p-6 pb-4 flex items-start justify-between border-b border-gray-100",
        className
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
          className="p-1.5 rounded-full text-gray-400 hover:text-frigus-navy hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
