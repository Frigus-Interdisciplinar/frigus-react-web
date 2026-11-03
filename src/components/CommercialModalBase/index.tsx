import { X } from "lucide-react";
import { useModalFocus } from "@/hooks/useModalFocus";
import type { BaseModalProps } from "@/types/component-props.type";

export function CommercialModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: BaseModalProps) {
  const dialogRef = useModalFocus(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[#0a1128]/50 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xs animate-in fade-in duration-200 sm:items-center">
      <div
        ref={dialogRef}
        role="dialog"
        id="commercial-modal-dialog"
        aria-modal="true"
        aria-labelledby="commercial-modal-title"
        tabIndex={-1}
        className="commercial-modal my-auto flex max-h-[calc(100dvh-2rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-[#343941] dark:bg-[#1C1E22]"
      >
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-[#343941] flex items-start justify-between">
          <div>
            <h2
              id="commercial-modal-title"
              className="text-xl font-bold text-[#141C55] dark:text-white font-montserrat"
            >
              {title}
            </h2>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {footer && (
          <div className="p-6 pt-4 border-t border-gray-100 dark:border-[#343941] bg-gray-50/50 dark:bg-[#181B1F] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
