import { type ReactNode } from "react";
import { cn } from "@/utils/cn.util";

export type ModalFooterProps = {
  helperText?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm?: () => void;
  className?: string;
  children?: ReactNode;
};

export default function ModalFooter({
  helperText,
  cancelLabel = "Cancelar",
  confirmLabel = "Adicionar itens",
  onCancel,
  onConfirm,
  className,
  children,
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        "p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {children ? (
        children
      ) : (
        <>
          {helperText && (
            <p className="text-[11px] text-gray-400 text-center sm:text-left">
              {helperText}
            </p>
          )}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end ml-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/60 transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-frigus-primary hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
