import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


import type { ShoppingListSuggestion } from "@/types/shopping-list.type";
import type { Product } from "@/types/inventory.type";
import { Plus, Trash2, Check, Sparkles, Minus } from "lucide-react";
import { AddItemModal } from "@/components/Modal";
import { formatUnitOfMeasure } from "@/utils/unit.util";
import { useServiceOperations } from "@/hooks/useServiceOperations";

type ShoppingItem = {
  id: number;
  productId: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  checked: boolean;
  image?: string;
};

const categories: Record<string, string> = {
  FRUIT: "Frutas",
  VEGETABLE: "Vegetais",
  DAIRY: "Laticínios",
  GRAIN: "Mercearia",
  MEAT: "Carnes",
  BEVERAGE: "Bebidas",
  CLEANING: "Limpeza",
  PERSONAL_HYGIENE: "Higiene pessoal",
};

export default function ShoppingListPage() {
  const apiOperations = useServiceOperations();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [activeTab, setActiveTab] = useState<"pendentes" | "comprados">(
    "pendentes",
  );
  const [categoryFilter, setCategoryFilter] = useState("Todas as categorias");
  const [isModalOpen, setIsModalOpen] = useState(
    () => searchParams.get("alias") === "adicionar-item-lista",
  );
  const [listId, setListId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);
  const [suggestions, setSuggestions] = useState<ShoppingListSuggestion[]>([]);
  const [error, setError] = useState("");
  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(
      event.currentTarget
        .closest('[role="tablist"]')
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    const currentIndex = tabs.indexOf(event.currentTarget);
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (currentIndex +
              (event.key === "ArrowRight" ? 1 : -1) +
              tabs.length) %
            tabs.length;
    const nextTab = tabs[nextIndex];
    nextTab?.focus();
    if (nextTab?.id === "domestic-tab-pending") setActiveTab("pendentes");
    if (nextTab?.id === "domestic-tab-purchased") setActiveTab("comprados");
  };

  const loadList = useCallback(async (id: string, signal?: AbortSignal) => {
    const list = await apiOperations.shoppingLists.getShoppingList(id, signal);
    if (signal?.aborted) return;
    setItems(
      list.items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        category: categories[item.product.category] ?? item.product.category,
        quantity: item.quantity,
        unit: formatUnitOfMeasure(item.product.unitOfMeasure),
        checked: item.status === "PURCHASED",
      })),
    );
  }, [apiOperations.shoppingLists]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void (async () => {
      try {
        const context = await apiOperations.inventory.getInventoryContext(controller.signal);
        const stock = context.stocks[0];
        if (!stock) throw new Error("Crie um estoque para começar sua lista.");
        const open =
          (await apiOperations.shoppingLists.findOpenShoppingList(stock.id, controller.signal)) ??
          (await apiOperations.shoppingLists.createShoppingList(
            stock.id,
            "Lista de compras",
            controller.signal,
          ));
        if (!active) return;
        setListId(open.id);
        await loadList(open.id, controller.signal);
        const own = await apiOperations.shoppingLists.listGroupProducts(context.groupId, controller.signal);
        if (!active) return;
        setCatalog(own);
        setCatalogReady(true);
        const suggestions = await apiOperations.shoppingLists.listShoppingListSuggestions(
          stock.id,
          controller.signal,
        );
        if (active) setSuggestions(suggestions);
      } catch (reason) {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível carregar a lista de compras.",
          );
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [apiOperations.inventory, apiOperations.shoppingLists, loadList]);

  const toggleCheck = async (id: number) => {
    if (!listId) return;
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    try {
      await apiOperations.shoppingLists.setShoppingListItemStatus(
        listId,
        id,
        item.checked ? "PENDING" : "PURCHASED",
      );
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível atualizar o item.",
      );
    }
  };

  const removeItem = async (id: number) => {
    if (!listId) return;
    try {
      await apiOperations.shoppingLists.removeShoppingListItem(listId, id);
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível remover o item.",
      );
    }
  };

  const clearCompleted = async () => {
    if (!listId) return;
    try {
      await apiOperations.shoppingLists.clearPurchasedShoppingListItems(listId);
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível limpar os itens comprados.",
      );
    }
  };

  const addProducts = async (selectedIds: string[]) => {
    if (!listId) return;
    try {
      for (const value of selectedIds)
        await apiOperations.shoppingLists.addShoppingListItem(listId, Number(value), 1);
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível adicionar os produtos.",
      );
      throw reason;
    }
  };

  const addSuggestion = async (suggestion: ShoppingListSuggestion) => {
    if (!listId) return;
    try {
      await apiOperations.shoppingLists.addShoppingListItem(
        listId,
        suggestion.product.id,
        suggestion.suggestedQuantity,
      );
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível adicionar a sugestão.",
      );
    }
  };

  const changeQuantity = async (item: ShoppingItem, amount: number) => {
    if (!listId || amount < 1) return;
    try {
      await apiOperations.shoppingLists.setShoppingListItemQuantity(listId, item.id, amount);
      await loadList(listId);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível atualizar a quantidade.",
      );
    }
  };

  const pendingItems = items.filter((item) => !item.checked);
  const completedItems = items.filter((item) => item.checked);
  const visibleItems = (
    activeTab === "pendentes" ? pendingItems : completedItems
  ).filter(
    (item) =>
      categoryFilter === "Todas as categorias" ||
      item.category === categoryFilter,
  );
  const itemCategories = [...new Set(items.map((item) => item.category))];
  const purchaseProgress = items.length
    ? Math.round((completedItems.length / items.length) * 100)
    : 0;

  return (
    <>
      <div className="space-y-6">
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
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
            type="button"
            disabled={!listId}
            onClick={() => setIsModalOpen(true)}
            aria-expanded={isModalOpen}
            aria-haspopup="dialog"
            aria-controls="add-items-dialog"
            className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto cursor-pointer disabled:cursor-wait disabled:opacity-60"
          >
            <Plus size={16} />
            <span>Adicionar itens</span>
          </button>
        </div>

        <div className="rounded-xl border border-[#D5E1F2] bg-white p-2.5 dark:border-[#34383E] dark:bg-[#1B1D20] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Filtrar itens da lista"
            className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              id="domestic-tab-pending"
              aria-selected={activeTab === "pendentes"}
              aria-controls="domestic-shopping-panel"
              tabIndex={activeTab === "pendentes" ? 0 : -1}
              onKeyDown={handleTabKeyDown}
              onClick={() => setActiveTab("pendentes")}
              className={`flex-none px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "pendentes"
                  ? "bg-[#2552C8] text-white"
                  : "text-[#141C55] dark:text-neutral-300 hover:bg-[#F5F8FC] dark:hover:bg-[#25282C]"
              }`}
            >
              Pendentes <span className="ml-1">{pendingItems.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              id="domestic-tab-purchased"
              aria-selected={activeTab === "comprados"}
              aria-controls="domestic-shopping-panel"
              tabIndex={activeTab === "comprados" ? 0 : -1}
              onKeyDown={handleTabKeyDown}
              onClick={() => setActiveTab("comprados")}
              className={`flex-none px-3.5 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "comprados"
                  ? "bg-[#2552C8] text-white"
                  : "text-[#141C55] dark:text-neutral-300 hover:bg-[#F5F8FC] dark:hover:bg-[#25282C]"
              }`}
            >
              Comprados <span className="ml-1">{completedItems.length}</span>
            </button>
            <span className="hidden sm:block border-l border-[#E1E7F0] px-3 text-[10px] text-[#64748B] dark:border-[#34383E] dark:text-neutral-400">
              {pendingItems.length} itens em falta no estoque
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label htmlFor="domestic-shopping-category" className="sr-only">
              Filtrar por categoria
            </label>
            <select
              id="domestic-shopping-category"
              aria-label="Filtrar por categoria"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-9 min-w-[160px] rounded-md border border-[#D5E1F2] bg-white px-3 text-xs text-[#141C55] dark:border-[#34383E] dark:bg-[#1B1D20] dark:text-white"
            >
              <option>Todas as categorias</option>
              {itemCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div
            id="domestic-shopping-panel"
            role="tabpanel"
            aria-labelledby={
              activeTab === "pendentes"
                ? "domestic-tab-pending"
                : "domestic-tab-purchased"
            }
            tabIndex={0}
            className="lg:col-span-8 bg-white dark:bg-[#1B1D20] rounded-xl p-4 md:p-5 border border-gray-200/80 dark:border-[#34383E] space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#34383E]">
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm">
                {activeTab === "pendentes" ? "Para comprar" : "Itens comprados"}
              </h3>
              <span className="text-xs font-bold text-frigus-primary dark:text-[#A7BCFF] bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg">
                {activeTab === "pendentes"
                  ? `${pendingItems.length} itens`
                  : `${completedItems.length} itens`}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-[#34383E]">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => void toggleCheck(item.id)}
                      aria-label={
                        item.checked
                          ? `Marcar ${item.name} como pendente`
                          : `Marcar ${item.name} como comprado`
                      }
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
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
                        className="w-8 h-8 rounded-md object-cover bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-[#34383E]"
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

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 items-center rounded-md border border-[#D5E1F2] dark:border-[#34383E]">
                      <button
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        onClick={() =>
                          void changeQuantity(item, item.quantity - 1)
                        }
                        disabled={item.checked || item.quantity <= 1}
                        className="grid h-full w-8 place-items-center text-[#536782] hover:bg-[#F5F8FC] disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-[#25282C]"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="min-w-[44px] text-center text-[11px] font-semibold text-frigus-navy dark:text-white">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        onClick={() =>
                          void changeQuantity(item, item.quantity + 1)
                        }
                        disabled={item.checked}
                        className="grid h-full w-8 place-items-center text-[#536782] hover:bg-[#F5F8FC] disabled:opacity-40 dark:text-neutral-300 dark:hover:bg-[#25282C]"
                      >
                        <Plus size={13} />
                      </button>
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
              ))}
              {visibleItems.length === 0 && (
                <p className="py-8 text-center text-xs text-[#64748B] dark:text-neutral-400">
                  {categoryFilter === "Todas as categorias"
                    ? "Nenhum item nesta lista ainda."
                    : "Nenhum item encontrado nesta categoria."}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <section className="bg-white dark:bg-[#1B1D20] rounded-xl p-4 md:p-5 border border-gray-200/80 dark:border-[#34383E] space-y-4">
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
                {suggestions.map((suggestion) => {
                  const sug = {
                    name: suggestion.product.name,
                    desc: `${suggestion.reason === "OUT_OF_STOCK" ? "Sem estoque" : "Estoque baixo"} · adicionar ${suggestion.suggestedQuantity} ${formatUnitOfMeasure(suggestion.product.unitOfMeasure)}`,
                    letter: suggestion.product.name.charAt(0).toUpperCase(),
                  };
                  return (
                    <div
                      key={suggestion.product.id}
                      className="py-2.5 border-b border-gray-100 dark:border-[#34383E] flex items-center justify-between gap-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/60 text-frigus-primary dark:text-[#A7BCFF] font-bold text-xs flex items-center justify-center">
                          {sug.letter}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-frigus-navy dark:text-white">
                            {sug.name}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-neutral-400">
                            {sug.desc}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => void addSuggestion(suggestion)}
                        className="rounded-md bg-[#2552C8] px-3 py-1.5 text-[10px] font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
                        title="Adicionar à lista"
                      >
                        Adicionar
                      </button>
                    </div>
                  );
                })}
                {suggestions.length === 0 && (
                  <p className="text-xs text-gray-500">
                    Nenhuma reposição sugerida pelo estoque.
                  </p>
                )}
              </div>
            </section>
            <section className="bg-white dark:bg-[#1B1D20] rounded-xl p-4 md:p-5 border border-gray-200/80 dark:border-[#34383E]">
              <h3 className="text-sm font-bold text-frigus-navy dark:text-white">
                Resumo da compra
              </h3>
              <p className="mt-1 text-[11px] text-[#64748B] dark:text-neutral-400">
                {pendingItems.length}{" "}
                {pendingItems.length === 1
                  ? "item pendente"
                  : "itens pendentes"}{" "}
                nesta lista
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DDE6F5] dark:bg-[#34383E]">
                <div
                  className="h-full rounded-full bg-[#F9C968] transition-[width]"
                  style={{ width: `${purchaseProgress}%` }}
                />
              </div>
              <p className="mt-3 text-[11px] text-[#64748B] dark:text-neutral-400">
                {completedItems.length} de {items.length}{" "}
                {items.length === 1
                  ? "item já foi comprado"
                  : "itens já foram comprados"}
              </p>
            </section>
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={isModalOpen && catalogReady}
        onClose={() => setIsModalOpen(false)}
        items={catalog.map((product) => ({
          id: String(product.id),
          name: product.name,
          category: categories[product.category] ?? product.category,
          quantity: `1 ${formatUnitOfMeasure(product.unitOfMeasure)}`,
        }))}
        defaultSelectedIds={[]}
        onConfirm={addProducts}
      />
    </>
  );
}
