import { X } from "lucide-react";
import { useModalFocus } from "@/hooks/useModalFocus";
import type { EnterpriseModalBaseProps } from "@/types/enterprise-component-props.type";

export function EnterpriseModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-xl",
}: EnterpriseModalBaseProps) {
  const dialogRef = useModalFocus(isOpen, onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <button
        type="button"
        aria-label="Fechar janela"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        role="dialog"
        id="enterprise-modal-dialog"
        aria-modal="true"
        aria-labelledby="enterprise-modal-title"
        tabIndex={-1}
        className={`relative z-10 my-auto flex max-h-[calc(100dvh-2rem)] w-full ${maxWidth} flex-col overflow-hidden rounded-3xl border border-[#E1E7F0] bg-white text-[#141C55] shadow-2xl transition-colors dark:border-[#343941] dark:bg-[#1C1E22] dark:text-neutral-100`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E1E7F0] p-4 dark:border-[#343941] sm:p-6">
          <div>
            <h3
              id="enterprise-modal-title"
              className="text-lg font-bold font-montserrat text-[#141C55] dark:text-white"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#141C55] dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-4 sm:p-6">{children}</div>

        {footer && (
          <div className="p-5 border-t border-[#E1E7F0] dark:border-[#343941] bg-[#F5F8FC]/60 dark:bg-[#252A32]/40 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
