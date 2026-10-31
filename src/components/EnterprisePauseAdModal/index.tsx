import type { EnterprisePauseAdModalProps } from "@/components/EnterpriseModals/types";
import { EnterpriseModalBase } from "@/components/EnterpriseModalBase";

export function EnterprisePauseAdModal({
  isOpen,
  onClose,
  product = {
    name: "Kit brunch artesanal",
    category: "Congelados",
  },
}: EnterprisePauseAdModalProps) {
  return (
    <EnterpriseModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Pausar anúncio?"
      subtitle="O produto deixará de aparecer nos anúncios."
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E1E7F0] dark:border-[#343941] text-xs font-semibold text-[#64748B] dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Pausar anúncio
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#141C55] dark:text-white">
              {product.name}
            </h4>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              {product.category}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            Será pausado
          </span>
        </div>

        <p className="text-xs text-[#64748B] dark:text-neutral-400 leading-relaxed">
          O anúncio permanece salvo e poderá ser reativado a qualquer momento
          sem perder o histórico de cliques e visualizações.
        </p>
      </div>
    </EnterpriseModalBase>
  );
}
