import { useState } from "react";
import { X, Upload, Calendar, Image as ImageIcon } from "lucide-react";

interface EnterpriseModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function EnterpriseModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-xl",
}: EnterpriseModalBaseProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden text-[#141C55] dark:text-neutral-100 transition-colors`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E1E7F0] dark:border-[#343941] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-montserrat text-[#141C55] dark:text-white">
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#141C55] dark:text-neutral-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-[#E1E7F0] dark:border-[#343941] bg-[#F5F8FC]/60 dark:bg-[#252A32]/40 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// 1. Criar Anúncio Modal
export function EnterpriseCreateAdModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Congelados");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <EnterpriseModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Criar anúncio"
      subtitle="Adicione as informações que aparecerão no anúncio."
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
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Ir para pagamento
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload foto */}
        <div className="border-2 border-dashed border-[#E1E7F0] dark:border-[#343941] rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-[#252A32]/40 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <Upload size={20} />
          </div>
          <p className="text-xs font-semibold text-[#141C55] dark:text-white">
            Escolha uma foto do produto para o anúncio
          </p>
          <p className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1">
            PNG, JPG ou WEBP até 5 MB
          </p>
          <button
            type="button"
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-semibold text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-[#343941] transition-colors"
          >
            Adicionar foto
          </button>
        </div>

        {/* Nome do produto */}
        <div>
          <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
            Nome do produto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Kit brunch artesanal"
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>

        {/* Categoria e Preço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            >
              <option value="Congelados">Congelados</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Prontos">Prontos</option>
              <option value="Hortifruti">Hortifruti</option>
              <option value="Padaria">Padaria</option>
              <option value="Laticínios">Laticínios</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Preço do produto
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="R$ 0,00"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        {/* Período de exibição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Início da exibição
            </label>
            <div className="relative">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="dd/mm/aaaa"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-3 text-[#64748B] pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Fim da exibição
            </label>
            <div className="relative">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="dd/mm/aaaa"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-3 text-[#64748B] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
            Descrição do produto
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Descreva o produto, benefícios e especificações..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8] resize-none"
          />
        </div>
      </form>
    </EnterpriseModalBase>
  );
}

// 2. Editar Anúncio Modal
export function EnterpriseEditAdModal({
  isOpen,
  onClose,
  initialData = {
    name: "Kit brunch artesanal",
    category: "Congelados",
    price: "R$ 21,90",
    startDate: "01/09/2026",
    endDate: "30/09/2026",
    description: "Kit congelado com seleção de pães, quiches e acompanhamentos para cafeteria e bistrô.",
  },
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    name: string;
    category: string;
    price: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}) {
  const [name, setName] = useState(initialData.name);
  const [category, setCategory] = useState(initialData.category);
  const [price, setPrice] = useState(initialData.price);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const [description, setDescription] = useState(initialData.description);

  return (
    <EnterpriseModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar anúncio — ${name}`}
      subtitle="Atualize as informações do produto."
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
            Salvar alterações
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Foto atual */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941]">
          <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[#2552C8] dark:text-blue-400 shrink-0">
            <ImageIcon size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-[#141C55] dark:text-white">
              Foto do anúncio
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-0.5">
              kit-brunch-foto.jpg (1.2 MB)
            </p>
            <button
              type="button"
              className="mt-2 text-xs font-semibold text-[#2552C8] dark:text-blue-400 hover:underline cursor-pointer"
            >
              Alterar foto
            </button>
          </div>
        </div>

        {/* Nome do produto */}
        <div>
          <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
            Nome do produto
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>

        {/* Categoria e Preço */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            >
              <option value="Congelados">Congelados</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Prontos">Prontos</option>
              <option value="Hortifruti">Hortifruti</option>
              <option value="Padaria">Padaria</option>
              <option value="Laticínios">Laticínios</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Preço do produto
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        {/* Período */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Início da exibição
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Fim da exibição
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
            Descrição do produto
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8] resize-none"
          />
        </div>
      </div>
    </EnterpriseModalBase>
  );
}

// 3. Pausar Anúncio Modal
export function EnterprisePauseAdModal({
  isOpen,
  onClose,
  product = {
    name: "Kit brunch artesanal",
    category: "Congelados",
  },
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    category: string;
  };
}) {
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
          O anúncio permanece salvo e poderá ser reativado a qualquer momento sem perder o histórico de cliques e visualizações.
        </p>
      </div>
    </EnterpriseModalBase>
  );
}

// 4. Concluir Anúncio (Rascunho) Modal
export function EnterpriseFinishAdModal({
  isOpen,
  onClose,
  product = {
    name: "Wrap de falafel",
    category: "Padaria",
    price: "R$ 11,50",
  },
}: {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    category: string;
    price: string;
  };
}) {
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
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Período de veiculação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                defaultValue="01/10/2026"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white"
              />
              <input
                type="text"
                defaultValue="31/10/2026"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5">
              Público-alvo sugerido
            </label>
            <p className="text-xs text-[#64748B] dark:text-neutral-400">
              Vegetarianos, público fitness e cafeterias parceiras na região Sudeste.
            </p>
          </div>
        </div>
      </div>
    </EnterpriseModalBase>
  );
}
