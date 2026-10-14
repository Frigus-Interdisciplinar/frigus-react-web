import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import { AddItemModal } from "@/components/Modal";
import { api } from "@/utils/api.util";
import { getInventoryContext } from "@/services/inventory.service";

type Product = { id: number; name: string; category: string; unitOfMeasure: string };
type Item = { id: number; product: Product; quantity: number; status: string };
type ShoppingList = { id: string; stockId: number; name: string; status: string; items: Item[] };
const categories: Record<string, string> = { FRUIT: "Frutas", VEGETABLE: "Vegetais", DAIRY: "Laticínios", GRAIN: "Mercearia", MEAT: "Carnes", BEVERAGE: "Bebidas", CLEANING: "Limpeza", PERSONAL_HYGIENE: "Higiene pessoal" };
const units: Record<string, string> = { KILOGRAM: "kg", GRAM: "g", LITER: "L", MILLILITER: "ml", UNIT: "un", DOZEN: "dúzia", PACKAGE: "pct" };

export default function CommercialShoppingListPage() {
  const [list, setList] = useState<ShoppingList>();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"PENDING" | "PURCHASED">("PENDING");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async (id: string) => setList(await api.get<ShoppingList>(`/web/core/shopping-lists/${id}`));

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const context = await getInventoryContext();
        const stock = context.stocks[0];
        if (!stock) throw new Error("Cadastre um estoque antes de criar uma lista de compras.");
        const page = await api.get<{ content: Array<{ id: string; status: string }> }>(`/web/core/shopping-lists?stockId=${stock.id}&status=OPEN&page=0&size=20`);
        let open = page.content[0];
        if (!open) open = await api.post<ShoppingList>("/web/core/shopping-lists", { stockId: stock.id, name: "Compras do estabelecimento" });
        if (!active) return;
        await loadItems(open.id);
        setCatalog(await api.get<Product[]>(`/web/core/groups/${context.groupId}/products`));
      } catch (reason) { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar a lista de compras."); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  const changeItem = async (item: Item) => {
    if (!list) return;
    try { await api.patch(`/web/core/shopping-lists/${list.id}/items/${item.id}`, { status: item.status === "PURCHASED" ? "PENDING" : "PURCHASED" }); await loadItems(list.id); }
    catch { setError("Não foi possível atualizar este item."); }
  };

  const removeItem = async (id: number) => {
    if (!list) return;
    try { await api.delete(`/web/core/shopping-lists/${list.id}/items/${id}`); await loadItems(list.id); }
    catch { setError("Não foi possível remover este item."); }
  };

  const addItems = async (ids: string[]) => {
    if (!list) return;
    try { for (const id of ids) await api.post(`/web/core/shopping-lists/${list.id}/items`, { productId: Number(id), quantity: 1 }); await loadItems(list.id); }
    catch { setError("Não foi possível adicionar os itens selecionados."); }
  };

  const clearPurchased = async () => {
    if (!list) return;
    try { await api.delete(`/web/core/shopping-lists/${list.id}/purchased-items`); await loadItems(list.id); }
    catch { setError("Não foi possível limpar os itens comprados."); }
  };

  const completeList = async () => {
    if (!list) return;
    try {
      await api.post(`/web/core/shopping-lists/${list.id}/complete`, {});
      const next = await api.post<ShoppingList>("/web/core/shopping-lists", { stockId: list.stockId, name: "Compras do estabelecimento" });
      setList(next); setError("Compra registrada. Uma nova lista está pronta.");
    }
    catch { setError("Não foi possível concluir a lista. Marque os itens comprados e tente novamente."); }
  };

  const items = list?.items ?? [];
  const pending = items.filter((item) => item.status !== "PURCHASED");
  const purchased = items.filter((item) => item.status === "PURCHASED");
  const shown = activeTab === "PENDING" ? pending : purchased;

  return (
    <CommercialLayout activeSection="shopping-list" breadcrumb="Área comercial    /    Lista de compras">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">Lista de compras</h1><p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">Itens compartilhados para repor o estoque do estabelecimento.</p></div><button type="button" disabled={!list} onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 bg-[#2552C8] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold"><Plus size={16} /> Adicionar item</button></div>
        {error && <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>}
        <section className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#343941] pb-4"><div className="flex gap-3"><button onClick={() => setActiveTab("PENDING")} className={`px-3 py-2 rounded-lg text-xs font-semibold ${activeTab === "PENDING" ? "bg-blue-50 text-blue-700" : "text-gray-500"}`}>Pendentes ({pending.length})</button><button onClick={() => setActiveTab("PURCHASED")} className={`px-3 py-2 rounded-lg text-xs font-semibold ${activeTab === "PURCHASED" ? "bg-blue-50 text-blue-700" : "text-gray-500"}`}>Comprados ({purchased.length})</button></div><div className="flex gap-3"><button type="button" disabled={!purchased.length} onClick={() => void clearPurchased()} className="text-xs text-gray-500 disabled:opacity-40">Limpar comprados</button><button type="button" disabled={!list || !items.length || pending.length > 0} onClick={() => void completeList()} className="text-xs font-semibold text-[#2552C8] disabled:opacity-40">Registrar compra concluída</button></div></div>
          {loading ? <p className="py-8 text-sm text-gray-500">Carregando lista…</p> : shown.length ? <div className="divide-y divide-gray-100 dark:divide-[#343941]">{shown.map((item) => <div key={item.id} className="py-4 flex items-center justify-between gap-4"><div className="flex items-center gap-3"><button type="button" aria-label="Marcar item comprado" onClick={() => void changeItem(item)} className={`size-5 rounded-md border flex items-center justify-center ${item.status === "PURCHASED" ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-300"}`}>{item.status === "PURCHASED" && <Check size={13} />}</button><div><p className="text-sm font-semibold text-[#141C55] dark:text-white">{item.product.name}</p><p className="text-xs text-gray-500">{categories[item.product.category] ?? item.product.category}</p></div></div><div className="flex items-center gap-4"><span className="text-xs font-semibold">{item.quantity} {units[item.product.unitOfMeasure] ?? "un"}</span><button type="button" aria-label="Remover item" onClick={() => void removeItem(item.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={15} /></button></div></div>)}</div> : <p className="py-8 text-sm text-gray-500">{activeTab === "PENDING" ? "Nenhum item pendente." : "Nenhum item comprado."}</p>}
        </section>
      </div>
      <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={catalog.map((product) => ({ id: String(product.id), name: product.name, category: categories[product.category] ?? product.category, quantity: `1 ${units[product.unitOfMeasure] ?? "un"}` }))} defaultSelectedIds={[]} onConfirm={addItems} />
    </CommercialLayout>
  );
}
