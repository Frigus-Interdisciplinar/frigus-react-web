import type { ModalVisibilityProps } from "@/components/CommercialModals/types";
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
          <select
            id="field-components-commercialexportreportmodal-index-tsx-1"
            defaultValue="Agosto 2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Agosto 2026</option>
            <option>Julho 2026</option>
            <option>Junho 2026</option>
          </select>
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
            defaultValue="PDF"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>PDF</option>
            <option>Planilha Excel (.xlsx)</option>
            <option>CSV</option>
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
            defaultValue="Resumo e gráficos"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Resumo e gráficos</option>
            <option>Detalhamento completo</option>
            <option>Apenas métricas financeiras</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="field-components-commercialexportreportmodal-index-tsx-4"
            className="block text-xs font-semibold text-[#141C55] mb-1"
          >
            Estabelecimento
          </label>
          <input
            id="field-components-commercialexportreportmodal-index-tsx-4"
            type="text"
            defaultValue="Sabor & Cia"
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}
