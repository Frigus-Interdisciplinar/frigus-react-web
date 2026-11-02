import { useState } from "react";
import { Upload, Calendar } from "lucide-react";
import { useResetModalState } from "@/hooks/useResetModalState";
import type { EnterpriseModalVisibilityProps } from "@/components/EnterpriseModals/types";
import { EnterpriseModalBase } from "@/components/EnterpriseModalBase";

export function EnterpriseCreateAdModal({
  isOpen,
  onClose,
}: EnterpriseModalVisibilityProps) {
  const [form, setForm] = useState({
    name: "",
    category: "Congelados",
    price: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  useResetModalState(isOpen, () => {
    setForm({
      name: "",
      category: "Congelados",
      price: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  });

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

        <div>
          <label
            htmlFor="enterprise-create-ad-name"
            className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
          >
            Nome do produto
          </label>
          <input
            id="enterprise-create-ad-name"
            type="text"
            maxLength={160}
            value={form.name}
            onChange={(e) =>
              setForm((current) => ({ ...current, name: e.target.value }))
            }
            placeholder="Informe o nome do produto"
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enterprise-create-ad-category"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Categoria
            </label>
            <select
              id="enterprise-create-ad-category"
              value={form.category}
              onChange={(e) =>
                setForm((current) => ({ ...current, category: e.target.value }))
              }
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
            <label
              htmlFor="enterprise-create-ad-price"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Preço do produto
            </label>
            <input
              id="enterprise-create-ad-price"
              type="text"
              maxLength={24}
              value={form.price}
              onChange={(e) =>
                setForm((current) => ({ ...current, price: e.target.value }))
              }
              placeholder="R$ 0,00"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enterprise-create-ad-start"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Início da exibição
            </label>
            <div className="relative">
              <input
                id="enterprise-create-ad-start"
                type="text"
                maxLength={10}
                value={form.startDate}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    startDate: e.target.value,
                  }))
                }
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
            <label
              htmlFor="enterprise-create-ad-end"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Fim da exibição
            </label>
            <div className="relative">
              <input
                id="enterprise-create-ad-end"
                type="text"
                maxLength={10}
                value={form.endDate}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    endDate: e.target.value,
                  }))
                }
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

        <div>
          <label
            htmlFor="enterprise-create-ad-description"
            className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
          >
            Descrição do produto
          </label>
          <textarea
            id="enterprise-create-ad-description"
            maxLength={2000}
            value={form.description}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="Descreva o produto, benefícios e especificações..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8] resize-none"
          />
        </div>
      </form>
    </EnterpriseModalBase>
  );
}
