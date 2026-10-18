import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronDown, Filter } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialAddBatchModal,
  CommercialFilterStockModal,
} from "@/components/CommercialModals";
import { createProduct, createStockProduct, getInventoryContext, listStockProducts, type StockProduct } from "@/services/inventory.service";
import type { CommercialBatchInput } from "@/components/CommercialModals";
import { api } from "@/utils/api.util";

interface BatchItem {
  id: string;
  name: string;
  batchCode: string;
  supplier: string;
  category: string;
  location: "Câmara fria" | "Depósito" | "Área de venda" | "Freezers";
  quantity: string;
  unitPrice: number;
  imageUrl?: string;
  expiration: string;
  status: "Em dia" | "Vence em 2 dias" | "Vencido" | "Estoque baixo";
}

export default function CommercialStockPage() {
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [inventory, setInventory] = useState<{ groupId: string; stocks: Array<{ id: number; name: string }> }>();
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState<string>("Todos os locais");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [selectedStatus, setSelectedStatus] = useState("Todas");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const loadStock = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const context = await getInventoryContext();
      setInventory(context);
      const activeStock = context.stocks[0];
      if (!activeStock) { setBatches([]); return; }
      const products = await listStockProducts(activeStock.id);
      setBatches(products.map((item: StockProduct) => {
        const name = item.product?.name ?? `Produto #${item.productId}`;
        const days = Math.ceil((new Date(`${item.expireDate}T00:00:00`).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
        const status: BatchItem["status"] = item.quantity <= (item.minimalQuantity ?? 0) ? "Estoque baixo" : days < 0 ? "Vencido" : days <= 2 ? "Vence em 2 dias" : "Em dia";
        const places: Record<string, BatchItem["location"]> = { FRIDGE: "Câmara fria", FREEZER: "Freezers", PANTRY: "Depósito", CABINET: "Depósito", SHELF: "Área de venda" };
        return {
          id: String(item.id), name, batchCode: `#${item.id}`, supplier: item.product?.brand ?? "—",
          unitPrice: item.product?.unitPrice ?? 0, imageUrl: item.product?.imageUrl,
          category: item.product?.category ?? item.category ?? "Outros",
          location: places[item.product?.storagePlace ?? ""] ?? "Depósito",
          quantity: `${item.quantity} ${item.product?.unitOfMeasure ?? "un"}`,
          expiration: new Date(`${item.expireDate}T00:00:00`).toLocaleDateString("pt-BR"), status,
        };
      }));
    } catch {
      setLoadError("Não foi possível carregar o estoque. Tente atualizar a página.");
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadStock(); }, []);

  const addBatch = async (input: CommercialBatchInput) => {
    if (!inventory) throw new Error("Grupo indisponível");
    let targetStock = inventory.stocks[0];
    if (!targetStock) {
      const created = await api.post<{ id: number; name: string }>("/web/core/inventory/stocks", { groupId: inventory.groupId, name: "Estoque comercial" });
      targetStock = created;
      setInventory({ ...inventory, stocks: [created] });
    }
    const categories: Record<string, string> = { "Proteínas": "MEAT", "Hortifruti": "VEGETABLE", "Mercearia": "GRAIN", "Laticínios": "DAIRY" };
    const places: Record<string, string> = { "Câmara fria": "FRIDGE", "Freezers": "FREEZER", "Depósito": "PANTRY", "Área de venda": "SHELF" };
    const units: Record<string, string> = { "Quilograma (kg)": "KILOGRAM", kg: "KILOGRAM", g: "GRAM", L: "LITER", ml: "MILLILITER", un: "UNIT", cx: "PACKAGE", pct: "PACKAGE" };
    const product = await createProduct(inventory.groupId, { name: input.product.trim(), category: categories[input.category] ?? "GRAIN", storagePlace: places[input.location] ?? "PANTRY", unitPrice: input.unitCost, unitOfMeasure: units[input.unit] ?? "UNIT" });
    await createStockProduct({ productId: product.id, stockId: targetStock.id, quantity: input.quantity, expireDate: input.expiry });
    await loadStock();
  };

  const locationTabs = [
    { label: "Todos os locais", count: batches.length },
    { label: "Depósito", count: batches.filter((item) => item.location === "Depósito").length },
    { label: "Câmara fria", count: batches.filter((item) => item.location === "Câmara fria").length },
    { label: "Área de venda", count: batches.filter((item) => item.location === "Área de venda").length },
    { label: "Freezers", count: batches.filter((item) => item.location === "Freezers").length },
  ];

  const filteredBatches = batches.filter((item) => {
    const matchesLocation =
      activeLocation === "Todos os locais" || item.location === activeLocation;
    const matchesCategory =
      selectedCategory === "Todas as categorias" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "Todas" || item.status === selectedStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesLocation && matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BatchItem["status"]) => {
    switch (status) {
      case "Em dia":
        return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">Em dia</span>;
      case "Vence em 2 dias":
        return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">Vence em 2 dias</span>;
      case "Vencido":
        return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200/60">Vencido</span>;
      case "Estoque baixo":
        return <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/60">Estoque baixo</span>;
    }
  };

  return (
    <CommercialLayout activeSection="stock" breadcrumb="Área comercial    /    Estoque">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Estoque do estabelecimento
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Produtos, lotes e quantidades para manter a operação em dia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Adicionar produto</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
          <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Produtos em estoque</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white mt-1">{loading ? "—" : batches.reduce((sum, item) => sum + Number.parseFloat(item.quantity), 0).toLocaleString("pt-BR")}</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">Unidades cadastradas</span>
        </div>
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
          <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Lotes ativos</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white mt-1">{loading ? "—" : batches.length}</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">Rastreabilidade por entrada</span>
        </div>
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
          <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Valor em estoque</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white mt-1">{loading ? "—" : batches.reduce((sum, item) => sum + Number.parseFloat(item.quantity) * item.unitPrice, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">Custo total dos produtos</span>
        </div>
        <div className="bg-white dark:bg-[#1C1E22] p-5 rounded-2xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs">
          <span className="text-xs font-medium text-[#64748B] dark:text-neutral-400">Precisam de reposição</span>
          <p className="text-2xl font-bold font-montserrat text-orange-600 dark:text-orange-400 mt-1">{loading ? "—" : batches.filter((item) => item.status === "Estoque baixo").length}</p>
          <span className="text-[11px] text-[#64748B] dark:text-neutral-400 mt-1 block">Abaixo do estoque mínimo</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#e1e7f0] dark:border-[#343941] shadow-xs overflow-hidden">
        {/* Location Tabs */}
        <div className="flex items-center gap-6 px-6 pt-5 border-b border-[#e1e7f0] dark:border-[#343941] overflow-x-auto">
          {locationTabs.map((tab) => {
            const isActive = activeLocation === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveLocation(tab.label)}
                className={`pb-4 text-xs font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive ? "text-[#2552C8] dark:text-blue-400" : "text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-blue-50 dark:bg-blue-900/30 text-[#2552C8] dark:text-blue-400" : "bg-gray-100 dark:bg-[#252A32] text-gray-500 dark:text-neutral-400"
                }`}>
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2552C8] dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-[#343941]">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto, lote ou fornecedor"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs focus:outline-hidden focus:border-[#2552C8] dark:focus:border-blue-500 bg-gray-50/50 dark:bg-[#252A32] text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
            >
              <Filter size={14} className="text-gray-400 dark:text-neutral-400" />
              <span>{selectedCategory}</span>
              <ChevronDown size={14} className="text-gray-400 dark:text-neutral-400" />
            </button>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors bg-white dark:bg-[#252A32] cursor-pointer"
            >
              <option value="Todas">Situação</option>
              <option value="Em dia">Em dia</option>
              <option value="Vence em 2 dias">Vence em 2 dias</option>
              <option value="Vencido">Vencido</option>
              <option value="Estoque baixo">Estoque baixo</option>
            </select>
          </div>
        </div>

        {loadError && <div role="alert" className="px-6 py-3 text-sm text-red-700 dark:text-red-300">{loadError} <button onClick={() => void loadStock()} className="underline">Tentar novamente</button></div>}
        {loading && <div className="px-6 py-8 text-sm text-gray-500">Carregando estoque…</div>}
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 dark:bg-[#181B1F] border-b border-gray-100 dark:border-[#343941] text-[11px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-6">Produto / Lote</th>
                <th className="py-3 px-6">Local</th>
                <th className="py-3 px-6">Quantidade</th>
                <th className="py-3 px-6">Validade</th>
                <th className="py-3 px-6">Situação</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
                {!loading && filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 dark:text-neutral-400">
                    Nenhum produto ou lote encontrado para os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50/80 dark:hover:bg-[#252A32] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {batch.imageUrl ? <img src={batch.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-md bg-gray-100 object-cover dark:bg-[#252A32]" /> : <div aria-hidden="true" className="h-10 w-10 shrink-0 rounded-md bg-[#EAF3FF] dark:bg-blue-950/50" />}
                        <div className="flex min-w-0 flex-col">
                        <Link
                          to={`/commercial/stock/${batch.id}`}
                          className="font-bold text-[#141C55] dark:text-white hover:text-[#2552C8] dark:hover:text-blue-400 transition-colors"
                        >
                          {batch.name}
                        </Link>
                        <span className="text-[11px] text-[#64748B] dark:text-neutral-400">
                          {batch.batchCode} · {batch.supplier}
                        </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-neutral-300 font-medium">{batch.location}</td>
                    <td className="py-4 px-6 font-bold text-[#141C55] dark:text-white">{batch.quantity}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-neutral-300">{batch.expiration}</td>
                    <td className="py-4 px-6">{getStatusBadge(batch.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/commercial/stock/${batch.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 px-6 border-t border-gray-100 dark:border-[#343941] flex items-center justify-between text-xs text-[#64748B] dark:text-neutral-400">
          <span>Mostrando {filteredBatches.length} de {batches.length} produtos</span>
          <span>{filteredBatches.length} resultado{filteredBatches.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      {/* Modais */}
      <CommercialAddBatchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addBatch} />
      <CommercialFilterStockModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
    </CommercialLayout>
  );
}
