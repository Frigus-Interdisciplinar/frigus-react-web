import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronDown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge, { type BadgeVariant } from "@/components/Badge";
import { AddFoodModal } from "@/components/Modal";
import type { NewFoodData } from "@/components/Modal/AddFoodModal";
import StockSidebar from "./StockSidebar";
import { createProduct, createStockProduct, getInventoryContext, listStockProducts, type AccountInventoryContext, type StockProduct } from "@/services/inventory.service";

type StockItem = {
  id: number;
  name: string;
  brand: string;
  category: string;
  quantity: string;
  location: "Despensa" | "Geladeira" | "Freezer";
  expiration: string;
  status: string;
  statusVariant: BadgeVariant;
  image?: string;
};

const categoryLabels: Record<string, string> = { FRUIT: "Frutas", VEGETABLE: "Vegetais", DAIRY: "Laticínios", GRAIN: "Grãos e mercearia", MEAT: "Carnes", BEVERAGE: "Bebidas", CLEANING: "Limpeza", PERSONAL_HYGIENE: "Higiene pessoal" };
const unitLabels: Record<string, string> = { KILOGRAM: "kg", GRAM: "g", LITER: "L", MILLILITER: "ml", UNIT: "un", DOZEN: "dúzia", PACKAGE: "pct" };
const storageLabels: Record<string, StockItem["location"]> = { PANTRY: "Despensa", CABINET: "Despensa", SHELF: "Despensa", FRIDGE: "Geladeira", FREEZER: "Freezer" };

function mapStockItem(row: StockProduct): StockItem {
  const status = row.productStatus ?? "FRESH";
  return {
    id: row.id,
    name: row.product?.name ?? `Produto ${row.productId}`,
    brand: row.product?.brand ?? "",
    category: categoryLabels[row.product?.category ?? row.category] ?? row.category,
    quantity: `${row.quantity} ${unitLabels[row.product?.unitOfMeasure ?? "UNIT"] ?? "un"}`,
    location: storageLabels[row.product?.storagePlace ?? "PANTRY"] ?? "Despensa",
    expiration: new Date(`${row.expireDate}T12:00:00`).toLocaleDateString("pt-BR"),
    status: status === "EXPIRED" ? "Vencido" : status === "NEAR_EXPIRATION" ? "Vence em breve" : "Dentro do prazo",
    statusVariant: status === "EXPIRED" ? "danger" : status === "NEAR_EXPIRATION" ? "warning" : "success",
    image: row.product?.imageUrl,
  };
}

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [context, setContext] = useState<AccountInventoryContext | null>(null);
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<"Todos" | "Despensa" | "Geladeira" | "Freezer">("Todos");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadStock = async (activeContext?: AccountInventoryContext) => {
    setLoading(true);
    setLoadError("");
    try {
      const current = activeContext ?? await getInventoryContext();
      setContext(current);
      const stockId = selectedStockId && current.stocks.some((stock) => stock.id === selectedStockId) ? selectedStockId : current.stocks[0]?.id;
      setSelectedStockId(stockId ?? null);
      setItems(stockId ? (await listStockProducts(stockId)).map(mapStockItem) : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Não foi possível carregar o estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadStock(); }, []);

  const handleAddFood = async (data: NewFoodData) => {
    const current = context ?? await getInventoryContext();
    const stockId = selectedStockId ?? current.stocks[0]?.id;
    if (!stockId) throw new Error("Nenhum estoque ativo está disponível para esta conta.");
    const product = await createProduct(current.groupId, {
      name: data.name,
      category: data.category,
      storagePlace: data.location === "Geladeira" ? "FRIDGE" : data.location === "Freezer" ? "FREEZER" : "PANTRY",
      unitPrice: data.unitPrice,
      unitOfMeasure: data.unitOfMeasure,
    });
    await createStockProduct({ productId: product.id, stockId, quantity: data.quantity, expireDate: data.expiration });
    await loadStock(current);
  };

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "Todos" || item.location === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesTab && matchesSearch && matchesStatus;
  });
  const stockStats = (["Despensa", "Geladeira", "Freezer"] as const).map((name, index) => {
    const count = items.filter((item) => item.location === name).length;
    return { name, count, color: ["#2552C8", "#6D91EA", "#E1A11B"][index], percentage: items.length ? Math.round(count / items.length * 100) : 0 };
  });

  return (
    <AppLayout activeSection="stock">
      <div className="space-y-6">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Estoque da casa
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Acompanhe os alimentos disponíveis em cada espaço da casa
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={16} />
              <span>Adicionar item</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Controles */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-4 md:p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Abas de Localização */}
            <div className="flex items-center bg-gray-100/80 dark:bg-[#252A32] p-1 rounded-2xl w-full md:w-auto">
              {(["Todos", "Despensa", "Geladeira", "Freezer"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-white dark:bg-[#1C1E22] text-frigus-navy dark:text-white shadow-xs"
                      : "text-gray-500 dark:text-neutral-400 hover:text-frigus-navy dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Campo de Busca */}
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar alimento"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs focus:outline-hidden focus:border-frigus-primary dark:focus:border-[#5B89F7] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500 bg-gray-50/50 dark:bg-[#252A32] text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#343941] flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 dark:text-neutral-400 font-medium mr-1">Filtrar por:</span>
              {["Categoria", "Validade", "Quantidade"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:border-gray-300 dark:hover:border-neutral-500 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
                >
                  <span>{filter}</span>
                  <ChevronDown size={14} className="text-gray-400 dark:text-neutral-400" />
                </button>
              ))}
            </div>

            {statusFilter && (
              <button
                type="button"
                onClick={() => setStatusFilter(null)}
                className="text-xs text-frigus-primary dark:text-[#5B89F7] font-bold hover:underline cursor-pointer"
              >
                Limpar filtro de status ({statusFilter})
              </button>
            )}
          </div>
        </div>

        {/* Layout Principal em 2 Colunas: Tabela (Esquerda) + Resumo & Ações (Direita) */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Tabela de Alimentos */}
          <div className="flex-1 w-full bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                  Alimentos cadastrados
                </h3>
                <p className="text-xs text-gray-400 dark:text-neutral-400">
                  {filteredItems.length} de {items.length} itens no espaço
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-[#EAF3FF] dark:bg-blue-950/50 text-frigus-primary dark:text-[#A7BCFF] rounded-xl">
                {items.length} itens totais
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider border-b border-gray-100 dark:border-[#343941]">
                    <th className="py-3 px-4">Alimento</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Qtd.</th>
                    <th className="py-3 px-4">Local</th>
                    <th className="py-3 px-4">Validade</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#343941]/50">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 dark:text-neutral-500 text-xs">
                        {loading ? "Carregando estoque…" : loadError || "Seu estoque ainda está vazio. Adicione o primeiro produto para começar."}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-[#252A32] transition-colors group">
                        <td className="py-3.5 px-4 font-bold text-frigus-navy dark:text-white">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-[#343941]"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-frigus-primary dark:text-[#A7BCFF] font-bold flex items-center justify-center text-xs">
                                {item.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-frigus-navy dark:text-white text-sm">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-neutral-400 font-normal">
                                {item.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs font-medium">
                          {item.category}
                        </td>
                        <td className="py-3.5 px-4 text-frigus-navy dark:text-white text-xs font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">
                          {item.location}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 dark:text-neutral-300 text-xs">
                          {item.expiration}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant={item.statusVariant}>{item.status}</Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/stock/${item.id}`}
                            className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold text-frigus-primary dark:text-[#5B89F7] hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Barra Lateral Direita: Resumo do Estoque + Ações Rápidas (Figma 1879:2717 & 1879:2736) */}
          <StockSidebar
            stats={stockStats}
            onFilterExpired={() => setStatusFilter((prev) => (prev === "Vencido" ? null : "Vencido"))}
          />
        </div>
      </div>

      {/* Modal Dedicado de Adicionar Alimento (Figma 1879:4634) */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddFood}
      />
    </AppLayout>
  );
}
