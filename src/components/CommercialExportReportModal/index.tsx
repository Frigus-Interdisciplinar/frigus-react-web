import type { ModalVisibilityProps } from "@/types/component-props.type";
import { CommercialModalBase } from "@/components/CommercialModalBase";

export function CommercialExportReportModal({
  isOpen,
  onClose,
}: ModalVisibilityProps) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar relatório"
      subtitle="Escolha como deseja consultar o fechamento."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Exportar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="field-components-commercialexportreportmodal-index-tsx-1"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Período
          </label>
          <input
            id="field-components-commercialexportreportmodal-index-tsx-1"
            type="month"
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="field-components-commercialexportreportmodal-index-tsx-2"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Formato
          </label>
          <select
            id="field-components-commercialexportreportmodal-index-tsx-2"
            defaultValue=""
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option value="" disabled>Selecione o formato</option>
            <option value="PDF">PDF</option>
            <option value="XLSX">Planilha Excel (.xlsx)</option>
            <option value="CSV">CSV</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialexportreportmodal-index-tsx-3"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Conteúdo
          </label>
          <select
            id="field-components-commercialexportreportmodal-index-tsx-3"
            defaultValue=""
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option value="" disabled>Selecione o conteúdo</option>
            <option value="summary">Resumo e gráficos</option>
            <option value="full">Detalhamento completo</option>
            <option value="financial">Apenas métricas financeiras</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}
