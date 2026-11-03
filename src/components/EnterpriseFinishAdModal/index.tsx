import type { EnterpriseFinishAdModalProps } from "@/types/component-props.type";
import { EnterpriseModalBase } from "@/components/EnterpriseModalBase";

export function EnterpriseFinishAdModal({
  isOpen,
  onClose,
  product,
}: EnterpriseFinishAdModalProps) {
  return (
    <EnterpriseModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Concluir anúncio"
      subtitle="Complete as informações para ativar a veiculação do produto."
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
            className="px-5 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Ir para pagamento
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#141C55] dark:text-white">
              {product.name}
            </h4>
            <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
              {product.category} · {product.price}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
            Rascunho
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                htmlFor="enterprise-finish-start"
                className="text-xs font-semibold text-[#141C55] dark:text-white"
              >
                Início
                <input
                  id="enterprise-finish-start"
                  type="date"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white"
                />
              </label>
              <label
                htmlFor="enterprise-finish-end"
                className="text-xs font-semibold text-[#141C55] dark:text-white"
              >
                Fim
                <input
                  id="enterprise-finish-end"
                  type="date"
                  className="mt-1 w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white"
                />
              </label>
            </div>
          </div>

          <div>
            <span className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Público-alvo sugerido
            </span>
            <p className="text-xs text-[#64748B] dark:text-neutral-400">
              Nenhum público-alvo foi definido para este anúncio.
            </p>
          </div>
        </div>
      </div>
    </EnterpriseModalBase>
  );
}
