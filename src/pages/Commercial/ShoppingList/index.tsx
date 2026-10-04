import { useState } from "react";
import { Plus, Check, ShoppingCart } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialAddShoppingItemModal,
  CommercialCompletePurchaseModal,
} from "@/components/CommercialModals";

interface ShoppingItem {
  id: string;
  name: string;
  supplier: string;
  quantity: string;
  price: string;
  purchased: boolean;
}

export default function CommercialShoppingListPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "bought">("pending");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: "1",
      name: "Tomate italiano para molho",
      supplier: "Hortifruti Central",
      quantity: "12 kg",
      price: "R$ 380,00",
      purchased: false,
    },
    {
      id: "2",
      name: "Mix de folhas higienizadas",
      supplier: "Hortifruti Central",
      quantity: "20 un",
      price: "R$ 110,00",
      purchased: false,
    },
    {
      id: "3",
      name: "Peito de frango",
      supplier: "Distribuidora Alfa",
      quantity: "20 kg",
      price: "R$ 420,00",
      purchased: false,
    },
    {
      id: "4",
      name: "Iogurte natural food service",
      supplier: "Distribuidora Alfa",
      quantity: "12 cx",
      price: "R$ 190,00",
      purchased: false,
    },
    {
      id: "5",
      name: "Arroz parboilizado 5 kg",
      supplier: "Atacadista Bom Preço",
      quantity: "12 pct",
      price: "R$ 270,00",
      purchased: false,
    },
    {
      id: "6",
      name: "Óleo de soja 5 L",
      supplier: "Atacadista Bom Preço",
      quantity: "8 un",
      price: "R$ 260,00",
      purchased: false,
    },
    {
      id: "7",
      name: "Açúcar refinado 1 kg",
      supplier: "Atacadista Bom Preço",
      quantity: "10 pct",
      price: "R$ 48,00",
      purchased: true,
    },
    {
      id: "8",
      name: "Sal marinho 1 kg",
      supplier: "Atacadista Bom Preço",
      quantity: "6 pct",
      price: "R$ 18,00",
      purchased: true,
    },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const pendingItems = items.filter((i) => !i.purchased);
  const boughtItems = items.filter((i) => i.purchased);
  const displayedItems = activeTab === "pending" ? pendingItems : boughtItems;

  return (
    <CommercialLayout
      activeSection="shopping-list"
      breadcrumb="Área comercial    /    Lista de compras"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Lista de compras
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Uma lista compartilhada para repor o que o estabelecimento precisa.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Adicionar item</span>
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itens (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold font-montserrat text-[#141C55] dark:text-white">
                Reposição da semana
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-[#2552C8] dark:text-blue-400">
                {items.length} itens
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 dark:border-[#343941]">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`pb-3 text-xs font-semibold relative cursor-pointer ${
                activeTab === "pending"
                  ? "text-[#2552C8] dark:text-blue-400"
                  : "text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              <span>Pendentes ({pendingItems.length})</span>
              {activeTab === "pending" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2552C8] dark:bg-blue-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bought")}
              className={`pb-3 text-xs font-semibold relative cursor-pointer ${
                activeTab === "bought"
                  ? "text-[#2552C8] dark:text-blue-400"
                  : "text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              <span>Comprados ({boughtItems.length})</span>
              {activeTab === "bought" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2552C8] dark:bg-blue-400" />
              )}
            </button>
          </div>

          {/* List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-8">✓</th>
                  <th className="py-2.5 px-3">Produto</th>
                  <th className="py-2.5 px-3">Quantidade</th>
                  <th className="py-2.5 px-3 text-right">Previsão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {displayedItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 dark:text-neutral-400">
                      Nenhum item nesta lista.
                    </td>
                  </tr>
                ) : (
                  displayedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors">
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                            item.purchased
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-gray-300 dark:border-[#343941] hover:border-[#2552C8] dark:hover:border-blue-400"
                          }`}
                        >
                          {item.purchased && <Check size={12} strokeWidth={3} />}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <p className={`font-bold ${item.purchased ? "line-through text-gray-400 dark:text-neutral-500" : "text-[#141C55] dark:text-white"}`}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-neutral-400">{item.supplier}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#141C55] dark:text-white">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-bold text-[#141C55] dark:text-white">{item.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-neutral-400 pt-2 border-t border-gray-100 dark:border-[#343941]">
            Valores estimados para o planejamento da reposição.
          </p>
        </div>

        {/* Right Column: Previsão & Sugestões (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Previsão */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#64748B] dark:text-neutral-400 tracking-wider uppercase">
                PREVISÃO DE COMPRA
              </span>
              <p className="text-3xl font-bold font-montserrat text-[#141C55] dark:text-white mt-1">
                R$ 1.630,00
              </p>
              <span className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5 block">
                6 itens pendentes · 3 fornecedores
              </span>
            </div>

            {/* Budget Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-neutral-400">
                <span>Limite da compra: R$ 1.800,00</span>
                <span className="font-bold text-[#141C55] dark:text-white">90%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                <div className="h-full bg-[#2552C8] dark:bg-blue-500 rounded-full w-[90%]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCompleteModalOpen(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart size={15} />
              <span>Concluir compra</span>
            </button>
          </div>

          {/* Card Sugestões */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold font-montserrat text-[#141C55] dark:text-white">
                Também precisa repor
              </h3>
              <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-0.5">
                Produtos abaixo do estoque mínimo
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
                <div>
                  <p className="text-xs font-bold text-[#141C55] dark:text-white">Queijo muçarela fatiado</p>
                  <p className="text-[11px] text-[#64748B] dark:text-neutral-400">Sugestão: 12 kg</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1E22] border border-gray-200 dark:border-[#343941] flex items-center justify-center text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941]">
                <div>
                  <p className="text-xs font-bold text-[#141C55] dark:text-white">Molho de tomate pouch</p>
                  <p className="text-[11px] text-[#64748B] dark:text-neutral-400">Sugestão: 24 unidades</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-[#1C1E22] border border-gray-200 dark:border-[#343941] flex items-center justify-center text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <CommercialAddShoppingItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <CommercialCompletePurchaseModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </CommercialLayout>
  );
}
