import { useEffect, useState } from "react";
import { api } from "@/utils/api.util";
import { getInventoryContext } from "@/services/inventory.service";
import {
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { AddItemModal } from "@/components/Modal";

type ShoppingItem = {
  id: number;
  productId: number;
  name: string;
  category: string;
  quantity: string;
  checked: boolean;
  image?: string;
};

type ShoppingListDto = { id: string; stockId: number; name: string; status: string; items: Array<{ id: number; product: { id: number; name: string; category: string; unitOfMeasure: string }; quantity: number; status: string }> };
type SuggestionDto = { product: { id: number; name: string; category: string; unitOfMeasure: string }; currentQuantity: number; suggestedQuantity: number; reason: string };
const units: Record<string, string> = { KILOGRAM: "kg", GRAM: "g", LITER: "L", MILLILITER: "ml", UNIT: "un", DOZEN: "dúzia", PACKAGE: "pct" };
const categories: Record<string, string> = { FRUIT: "Frutas", VEGETABLE: "Vegetais", DAIRY: "Laticínios", GRAIN: "Mercearia", MEAT: "Carnes", BEVERAGE: "Bebidas", CLEANING: "Limpeza", PERSONAL_HYGIENE: "Higiene pessoal" };

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pendentes" | "comprados">("pendentes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listId, setListId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Array<{ id: number; name: string; category: string; unitOfMeasure: string }>>([]);
  const [suggestions, setSuggestions] = useState<SuggestionDto[]>([]);
  const [error, setError] = useState("");

  const loadList = async (id: string) => {
    const list = await api.get<ShoppingListDto>(`/web/core/shopping-lists/${id}`);
    setItems(list.items.map((item) => ({
      id: item.id, productId: item.product.id, name: item.product.name,
      category: categories[item.product.category] ?? item.product.category,
      quantity: `${item.quantity} ${units[item.product.unitOfMeasure] ?? "un"}`,
      checked: item.status === "PURCHASED",
    })));
  };

  useEffect(() => {
    void (async () => {
      try {
        const context = await getInventoryContext();
        const stock = context.stocks[0];
        if (!stock) throw new Error("Crie um estoque para começar sua lista.");
        const page = await api.get<{ content: Array<{ id: string; status: string }> }>(`/web/core/shopping-lists?stockId=${stock.id}&status=OPEN&page=0&size=20`);
        let open = page.content[0];
        if (!open) open = await api.post<ShoppingListDto>("/web/core/shopping-lists", { stockId: stock.id, name: "Lista de compras" });
        setListId(open.id);
        await loadList(open.id);
        const own = await api.get<Array<{ id: number; name: string; category: string; unitOfMeasure: string }>>(`/web/core/groups/${context.groupId}/products`);
        setCatalog(own);
        setSuggestions(await api.get<SuggestionDto[]>(`/web/core/shopping-lists/suggestions?stockId=${stock.id}`));
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Não foi possível carregar a lista de compras.");
      }
    })();
  }, []);

  const toggleCheck = async (id: number) => {
    if (!listId) return;
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    try {
      await api.patch(`/web/core/shopping-lists/${listId}/items/${id}`, { status: item.checked ? "PENDING" : "PURCHASED" });
      await loadList(listId);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível atualizar o item."); }
  };

  const removeItem = async (id: number) => {
    if (!listId) return;
    try { await api.delete(`/web/core/shopping-lists/${listId}/items/${id}`); await loadList(listId); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível remover o item."); }
  };

  const clearCompleted = async () => {
    if (!listId) return;
    try { await api.delete(`/web/core/shopping-lists/${listId}/purchased-items`); await loadList(listId); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível limpar os itens comprados."); }
  };

  const addProducts = async (selectedIds: string[]) => {
    if (!listId) return;
    try {
      for (const value of selectedIds) await api.post(`/web/core/shopping-lists/${listId}/items`, { productId: Number(value), quantity: 1 });
      await loadList(listId);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível adicionar os produtos."); }
  };

  const addSuggestion = async (suggestion: SuggestionDto) => {
    if (!listId) return;
    try {
      await api.post(`/web/core/shopping-lists/${listId}/items`, { productId: suggestion.product.id, quantity: suggestion.suggestedQuantity });
      await loadList(listId);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível adicionar a sugestão."); }
  };

  const pendingItems = items.filter((item) => !item.checked);
  const completedItems = items.filter((item) => item.checked);

  return (
    <AppLayout activeSection="shopping-list">
      <div className="space-y-6">
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Lista de compras
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Organize o que está faltando e marque os itens quando comprar
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Adicionar itens</span>
          </button>
        </div>

        {/* Faixa de Alerta: Itens em falta */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
            <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              {suggestions.length} itens com estoque baixo precisam de reposição
            </span>
          </div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline cursor-pointer">
            Ver estoque
          </span>
        </div>

        {/* Abas e Filtros */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-4 md:p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-gray-100/80 dark:bg-[#252A32] p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("pendentes")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pendentes"
                  ? "bg-white dark:bg-[#1C1E22] text-frigus-navy dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-neutral-400 hover:text-frigus-navy dark:hover:text-white"
              }`}
            >
              Pendentes ({pendingItems.length})
            </button>
            <button
              onClick={() => setActiveTab("comprados")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "comprados"
                  ? "bg-white dark:bg-[#1C1E22] text-frigus-navy dark:text-white shadow-xs"
                  : "text-gray-500 dark:text-neutral-400 hover:text-frigus-navy dark:hover:text-white"
              }`}
            >
              Comprados ({completedItems.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer">
              <span>Todas as categorias</span>
              <ChevronDown size={14} className="text-gray-400 dark:text-neutral-400" />
            </button>

            {completedItems.length > 0 && (
              <button
                onClick={() => void clearCompleted()}
                className="text-xs font-bold text-gray-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Limpar concluídos
              </button>
            )}
          </div>
        </div>

        {/* Grid de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Itens (8 colunas) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#343941]">
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                {activeTab === "pendentes" ? "Para comprar" : "Itens comprados"}
              </h3>
              <span className="text-xs font-bold text-frigus-primary dark:text-[#A7BCFF] bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
                {activeTab === "pendentes"
                  ? `${pendingItems.length} itens`
                  : `${completedItems.length} itens`}
              </span>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-[#343941]/50">
              {(activeTab === "pendentes" ? pendingItems : completedItems).map(
                (item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => void toggleCheck(item.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                          item.checked
                            ? "bg-frigus-primary border-frigus-primary text-white"
                            : "border-gray-300 dark:border-neutral-600 hover:border-frigus-primary bg-white dark:bg-[#1C1E22]"
                        }`}
                      >
                        {item.checked && <Check size={14} strokeWidth={3} />}
                      </button>

                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-[#343941]"
                        />
                      )}

                      <div>
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            item.checked
                              ? "line-through text-gray-400 dark:text-neutral-500"
                              : "text-frigus-navy dark:text-white"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-neutral-400 font-medium">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantidade */}
                      <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#252A32] px-2.5 py-1 rounded-xl border border-gray-100 dark:border-[#343941]">
                        <span className="text-xs font-bold text-frigus-navy dark:text-white">
                          {item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => void removeItem(item.id)}
                        className="text-gray-300 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Remover item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sugestões da Casa (4 colunas) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-frigus-primary dark:text-[#5B89F7] mb-1">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Sugestões para você
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Com base na sua rotina
              </h3>
              <p className="text-xs text-gray-400 dark:text-neutral-400 mt-0.5">
                Alimentos que estão acabando no estoque da sua casa
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {suggestions.map((suggestion, idx) => { const sug = { name: suggestion.product.name, desc: `${suggestion.reason === "OUT_OF_STOCK" ? "Sem estoque" : "Estoque baixo"} · adicionar ${suggestion.suggestedQuantity} ${units[suggestion.product.unitOfMeasure] ?? "un"}`, letter: suggestion.product.name.charAt(0).toUpperCase() }; return (

                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50/70 dark:bg-[#252A32] border border-gray-100 dark:border-[#343941] flex items-center justify-between gap-3 hover:border-gray-200 dark:hover:border-neutral-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-frigus-primary dark:text-[#A7BCFF] font-bold text-xs flex items-center justify-center">
                      {sug.letter}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-frigus-navy dark:text-white">{sug.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-neutral-400">{sug.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => void addSuggestion(suggestion)}
                    className="p-1.5 rounded-lg text-frigus-primary dark:text-[#5B89F7] hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                    title="Adicionar à lista"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ); })}
              {suggestions.length === 0 && <p className="text-xs text-gray-500">Nenhuma reposição sugerida pelo estoque.</p>}
            </div>
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={catalog.map((product) => ({ id: String(product.id), name: product.name, category: categories[product.category] ?? product.category, quantity: `1 ${units[product.unitOfMeasure] ?? "un"}` }))}
        defaultSelectedIds={[]}
        onConfirm={addProducts}
      />
    </AppLayout>
  );
}
