import { useState } from "react";
import { ImageIcon } from "lucide-react";
import type { EnterpriseEditAdModalProps } from "@/components/EnterpriseModals/types";
import { EnterpriseModalBase } from "@/components/EnterpriseModalBase";

export function EnterpriseEditAdModal({
  isOpen,
  onClose,
  initialData = {
    name: "Kit brunch artesanal",
    category: "Congelados",
    price: "R$ 21,90",
    startDate: "01/09/2026",
    endDate: "30/09/2026",
    description:
      "Kit congelado com seleção de pães, quiches e acompanhamentos para cafeteria e bistrô.",
  },
}: EnterpriseEditAdModalProps) {
  const [form, setForm] = useState({
    name: initialData.name,
    category: initialData.category,
    price: initialData.price,
    startDate: initialData.startDate,
    endDate: initialData.endDate,
    description: initialData.description,
  });

  return (
    <EnterpriseModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar anúncio — ${form.name}`}
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

        <div>
          <label
            htmlFor="enterprise-edit-ad-name"
            className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
          >
            Nome do produto
          </label>
          <input
            id="enterprise-edit-ad-name"
            type="text"
            maxLength={160}
            value={form.name}
            onChange={(e) =>
              setForm((current) => ({ ...current, name: e.target.value }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enterprise-edit-ad-category"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Categoria
            </label>
            <select
              id="enterprise-edit-ad-category"
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
              htmlFor="enterprise-edit-ad-price"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Preço do produto
            </label>
            <input
              id="enterprise-edit-ad-price"
              type="text"
              maxLength={24}
              value={form.price}
              onChange={(e) =>
                setForm((current) => ({ ...current, price: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enterprise-edit-ad-start"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Início da exibição
            </label>
            <input
              id="enterprise-edit-ad-start"
              type="text"
              maxLength={10}
              value={form.startDate}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  startDate: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>

          <div>
            <label
              htmlFor="enterprise-edit-ad-end"
              className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
            >
              Fim da exibição
            </label>
            <input
              id="enterprise-edit-ad-end"
              type="text"
              maxLength={10}
              value={form.endDate}
              onChange={(e) =>
                setForm((current) => ({ ...current, endDate: e.target.value }))
              }
              className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="enterprise-edit-ad-description"
            className="block text-xs font-bold text-[#141C55] dark:text-white mb-1.5"
          >
            Descrição do produto
          </label>
          <textarea
            id="enterprise-edit-ad-description"
            maxLength={2000}
            value={form.description}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white focus:outline-hidden focus:border-[#2552C8] resize-none"
          />
        </div>
      </div>
    </EnterpriseModalBase>
  );
}
