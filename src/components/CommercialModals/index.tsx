import { useState, useEffect, type ReactNode } from "react";
import { X, AlertTriangle, AlertCircle, Clock, Check } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function CommercialModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: BaseModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1128]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-[560px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#141C55] font-montserrat">{title}</h2>
            <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// 1. Comercial — Adicionar produto ou lote (1879:2261)
export function CommercialAddBatchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    product: "",
    batchCode: "",
    category: "Proteínas",
    location: "Câmara fria",
    quantity: "0",
    unit: "Quilograma (kg)",
    expiry: "",
    unitCost: "R$ 0,00",
  });

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar produto ou lote"
      subtitle="Organize a entrada de um produto no estoque."
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
            Adicionar produto
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Produto</label>
          <input
            type="text"
            placeholder="Nome do produto"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Código do lote</label>
          <input
            type="text"
            placeholder="Ex.: LT-2053"
            value={formData.batchCode}
            onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Proteínas</option>
            <option>Hortifruti</option>
            <option>Mercearia</option>
            <option>Laticínios</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Local</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Câmara fria</option>
            <option>Depósito</option>
            <option>Área de venda</option>
            <option>Freezers</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Quantidade</label>
          <input
            type="text"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Unidade</label>
          <input
            type="text"
            placeholder="un / kg / cx"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Validade</label>
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Custo unitário</label>
          <input
            type="text"
            placeholder="R$ 0,00"
            value={formData.unitCost}
            onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 2. Comercial — Editar lote (1879:2276)
export function CommercialEditBatchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    product: "Peito de frango",
    batchCode: "FR-2048",
    category: "Proteínas",
    location: "Câmara fria",
    quantity: "32",
    unit: "Quilograma (kg)",
    expiry: "18/09/2026",
    unitCost: "R$ 18,90",
  });

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Editar lote"
      subtitle="Atualize as informações do lote FR-2048."
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
            Salvar alterações
          </button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Produto</label>
          <input
            type="text"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Código do lote</label>
          <input
            type="text"
            value={formData.batchCode}
            onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Proteínas</option>
            <option>Hortifruti</option>
            <option>Mercearia</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Local</label>
          <select
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white"
          >
            <option>Câmara fria</option>
            <option>Depósito</option>
            <option>Área de venda</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Quantidade</label>
          <input
            type="text"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Unidade</label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Validade</label>
          <input
            type="text"
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Custo unitário</label>
          <input
            type="text"
            value={formData.unitCost}
            onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 3. Comercial — Adicionar item à lista (1879:2302)
export function CommercialAddShoppingItemModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Adicionar item à lista"
      subtitle="Planeje a reposição do estabelecimento."
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
            Adicionar à lista
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Produto</label>
          <input
            type="text"
            placeholder="Nome do produto"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Quantidade</label>
          <input
            type="text"
            placeholder="Ex.: 12 caixas"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Fornecedor</label>
          <input
            type="text"
            placeholder="Selecione o fornecedor"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Valor estimado</label>
          <input
            type="text"
            placeholder="R$ 0,00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 4. Comercial — Registrar perda (1879:2313)
export function CommercialRegisterWasteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar perda"
      subtitle="Informe o lote e a quantidade retirada do estoque."
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
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Registrar perda
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Produto / lote</label>
          <input
            type="text"
            defaultValue="Iogurte food service · YG-082"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Quantidade</label>
          <input
            type="text"
            defaultValue="12 caixas"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Motivo</label>
          <select defaultValue="Validade expirada" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Validade expirada</option>
            <option>Manuseio / Avaria</option>
            <option>Transporte</option>
            <option>Excesso de preparo</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Data</label>
          <input
            type="text"
            defaultValue="06/09/2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 5. Comercial — Registrar movimentação (1879:2291)
export function CommercialRegisterMovementModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar movimentação"
      subtitle="Toda entrada e saída fica no histórico do lote."
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
            Registrar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Produto / lote</label>
          <input
            type="text"
            defaultValue="Peito de frango · FR-2048"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Tipo</label>
          <select defaultValue="Saída" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Saída</option>
            <option>Entrada</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Quantidade</label>
          <input
            type="text"
            defaultValue="6 kg"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Destino</label>
          <input
            type="text"
            defaultValue="Área de venda"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 6. Comercial — Registrar compra (1879:2324)
export function CommercialRegisterPurchaseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar compra"
      subtitle="Registre os valores e acompanhe o pedido."
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
            Salvar compra
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Fornecedor</label>
          <input
            type="text"
            placeholder="Selecione o fornecedor"
            defaultValue="Distribuidora Alfa"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Valor total</label>
          <input
            type="text"
            defaultValue="R$ 1.490,00"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Data da compra</label>
          <input
            type="text"
            defaultValue="06/09/2026"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Situação</label>
          <select defaultValue="A aprovar" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>A aprovar</option>
            <option>Em trânsito</option>
            <option>Recebido</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 7. Comercial — Exportar relatório (1879:2357)
export function CommercialExportReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Período</label>
          <select defaultValue="Agosto 2026" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Agosto 2026</option>
            <option>Julho 2026</option>
            <option>Junho 2026</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Formato</label>
          <select defaultValue="PDF" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>PDF</option>
            <option>Planilha Excel (.xlsx)</option>
            <option>CSV</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Conteúdo</label>
          <select defaultValue="Resumo e gráficos" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Resumo e gráficos</option>
            <option>Detalhamento completo</option>
            <option>Apenas métricas financeiras</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Estabelecimento</label>
          <input
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

// 8. Comercial — Convidar funcionário (1879:2335)
export function CommercialInviteEmployeeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Convidar funcionário"
      subtitle="A pessoa receberá um convite por e-mail."
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
            Enviar convite
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Nome completo</label>
          <input
            type="text"
            placeholder="Nome do funcionário"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">E-mail</label>
          <input
            type="email"
            placeholder="nome@exemplo.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Função</label>
          <select defaultValue="Operador" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Operador</option>
            <option>Estoquista</option>
            <option>Compras</option>
            <option>Gerente</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Unidade</label>
          <input
            type="text"
            defaultValue="Sabor & Cia · Centro"
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 9. Comercial — Gerenciar acesso (1879:2346)
export function CommercialManageAccessModal({
  isOpen,
  onClose,
  employeeName = "Ana Souza",
  employeeEmail = "ana@saborecia.com",
}: {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  employeeEmail?: string;
}) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Gerenciar acesso"
      subtitle="Defina a função e o acesso do funcionário."
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
            Salvar alterações
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Nome</label>
          <input
            type="text"
            defaultValue={employeeName}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">E-mail</label>
          <input
            type="email"
            defaultValue={employeeEmail}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Função</label>
          <select defaultValue="Gerente" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Gerente</option>
            <option>Estoquista</option>
            <option>Compras</option>
            <option>Operador</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Acesso</label>
          <select defaultValue="Ativo" className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-white">
            <option>Ativo</option>
            <option>Inativo / Bloqueado</option>
          </select>
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 10. Comercial — Filtrar estoque (1879:2390)
export function CommercialFilterStockModal({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}) {
  const [current, setCurrent] = useState(selectedCategory || "Todas as categorias");

  const categories = [
    "Todas as categorias",
    "Proteínas",
    "Hortifruti",
    "Mercearia",
  ];

  const handleConfirm = () => {
    if (onSelectCategory) onSelectCategory(current);
    onClose();
  };

  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Filtrar estoque"
      subtitle="Selecione a categoria que deseja visualizar."
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
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Ver resultados
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {categories.map((cat) => {
            const isSelected = current === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCurrent(cat)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2552C8] bg-blue-50/50 text-[#141C55]"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check size={16} className="text-[#2552C8]" />}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-[#64748B] leading-relaxed pt-2 border-t border-gray-100">
          Você também pode buscar pelo nome do produto, pelo fornecedor ou pelo código do lote.
        </p>
      </div>
    </CommercialModalBase>
  );
}

// 11. Comercial — Concluir compra (1879:2368)
export function CommercialCompletePurchaseModal({
  isOpen,
  onClose,
  totalItems = 6,
  totalAmount = "R$ 1.248,40",
}: {
  isOpen: boolean;
  onClose: () => void;
  totalItems?: number;
  totalAmount?: string;
}) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Concluir compra"
      subtitle="Confira o resumo antes de finalizar."
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
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Confirmar compra
          </button>
        </>
      }
    >
      <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/70">
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <span className="text-xs text-[#64748B]">Itens</span>
          <span className="text-xs font-bold text-[#141C55]">{totalItems} produtos</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <span className="text-xs text-[#64748B]">Valor total</span>
          <span className="text-sm font-bold text-emerald-600">{totalAmount}</span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-gray-200/50">
          <span className="text-xs text-[#64748B]">Data</span>
          <span className="text-xs font-semibold text-[#141C55]">06/09/2026</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-xs text-[#64748B]">Responsável</span>
          <span className="text-xs font-semibold text-[#141C55]">Ana Souza</span>
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 12. Comercial — Reenviar convite (1879:2379)
export function CommercialResendInviteModal({
  isOpen,
  onClose,
  name = "Beatriz Costa",
  email = "beatriz@saborecia.com",
}: {
  isOpen: boolean;
  onClose: () => void;
  name?: string;
  email?: string;
}) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Reenviar convite"
      subtitle="Confirme o endereço para enviar um novo convite."
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
            Reenviar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Nome</label>
          <input
            type="text"
            defaultValue={name}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">E-mail</label>
          <input
            type="email"
            defaultValue={email}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Função</label>
          <input
            type="text"
            defaultValue="Operador"
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#141C55] mb-1">Unidade</label>
          <input
            type="text"
            defaultValue="Sabor & Cia · Centro"
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 text-gray-600"
          />
        </div>
      </div>
    </CommercialModalBase>
  );
}

// 13. Comercial — Notificações (1879:2402)
export function CommercialNotificationsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <CommercialModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Notificações da operação"
      subtitle="O que precisa da sua atenção hoje."
    >
      <div className="space-y-3">
        <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-950">7 lotes vencem em até 3 dias</h4>
            <p className="text-xs text-amber-800 mt-0.5">Priorize a saída e reduza as perdas.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 flex items-start gap-3">
          <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-950">12 produtos precisam de reposição</h4>
            <p className="text-xs text-blue-800 mt-0.5">Revise a lista antes do próximo pedido.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/70 flex items-start gap-3">
          <AlertCircle size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-purple-950">1 convite aguarda confirmação</h4>
            <p className="text-xs text-purple-800 mt-0.5">Beatriz Costa ainda não acessou o Frigus.</p>
          </div>
        </div>
      </div>
    </CommercialModalBase>
  );
}
