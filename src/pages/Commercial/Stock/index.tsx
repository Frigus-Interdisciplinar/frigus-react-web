import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import CommercialLayout from "@/components/CommercialLayout";
import {
  CommercialAddBatchModal,
  CommercialFilterStockModal,
} from "@/components/CommercialModals";

interface BatchItem {
  id: string;
  name: string;
  batchCode: string;
  supplier: string;
  category: string;
  location: "Câmara fria" | "Depósito" | "Área de venda" | "Freezers";
  quantity: string;
  expiration: string;
  status: "Em dia" | "Vence em 2 dias" | "Vencido" | "Estoque baixo";
}

const mockBatches: BatchItem[] = [
  {
    id: "FR-2048",
    name: "Peito de frango",
    batchCode: "FR-2048",
    supplier: "Frigorífico Aurora",
    category: "Proteínas",
    location: "Câmara fria",
    quantity: "32 kg",
    expiration: "18 set 2026",
    status: "Em dia",
  },
  {
    id: "TM-318",
    name: "Tomate italiano para molho",
    batchCode: "TM-318",
    supplier: "Hortifruti Central",
    category: "Hortifruti",
    location: "Câmara fria",
    quantity: "24 kg",
    expiration: "08 set 2026",
    status: "Vence em 2 dias",
  },
  {
    id: "YG-082",
    name: "Iogurte natural food service",
    batchCode: "YG-082",
    supplier: "Vigor Profissional",
    category: "Mercearia",
    location: "Câmara fria",
    quantity: "12 cx",
    expiration: "05 set 2026",
    status: "Vencido",
  },
  {
    id: "AR-904",
    name: "Arroz parboilizado 5 kg",
    batchCode: "AR-904",
    supplier: "Camil Food Service",
    category: "Mercearia",
    location: "Depósito",
    quantity: "6 pct",
    expiration: "03 nov 2026",
    status: "Estoque baixo",
  },
  {
    id: "LT-2048",
    name: "Leite integral",
    batchCode: "LT-2048",
    supplier: "Fazenda Bela",
    category: "Mercearia",
    location: "Câmara fria",
    quantity: "48 un",
    expiration: "18 set 2026",
    status: "Em dia",
  },
  {
    id: "VG-082",
    name: "Iogurte natural",
    batchCode: "VG-082",
    supplier: "Vigor",
    category: "Mercearia",
    location: "Câmara fria",
    quantity: "12 cx",
    expiration: "05 set 2026",
    status: "Vencido",
  },
  {
    id: "HT-318",
    name: "Tomate italiano",
    batchCode: "HT-318",
    supplier: "Hortifruti Central",
    category: "Hortifruti",
    location: "Câmara fria",
    quantity: "24 kg",
    expiration: "08 set 2026",
    status: "Vence em 2 dias",
  },
  {
    id: "GD-904",
    name: "Arroz integral",
    batchCode: "GD-904",
    supplier: "Camil",
    category: "Mercearia",
    location: "Depósito",
    quantity: "6 pct",
    expiration: "03 nov 2026",
    status: "Estoque baixo",
  },
];

export default function CommercialStockPage() {
  const [activeLocation, setActiveLocation] = useState<string>("Todos os locais");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  const [selectedStatus, setSelectedStatus] = useState("Todas");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const locationTabs = [
    { label: "Todos os locais", count: 486 },
    { label: "Depósito", count: 184 },
    { label: "Câmara fria", count: 126 },
    { label: "Área de venda", count: 98 },
    { label: "Freezers", count: 78 },
  ];

  const filteredBatches = mockBatches.filter((item) => {
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
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55]">
            Estoque do estabelecimento
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Produtos, lotes e quantidades para manter a operação em dia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Adicionar produto</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Produtos em estoque</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] mt-1">486</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Distribuídos em 4 locais</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Lotes ativos</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] mt-1">128</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Rastreabilidade por entrada</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Valor em estoque</span>
          <p className="text-2xl font-bold font-montserrat text-[#141C55] mt-1">R$ 18.420</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Custo total dos produtos</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e1e7f0] shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Precisam de reposição</span>
          <p className="text-2xl font-bold font-montserrat text-orange-600 mt-1">12</p>
          <span className="text-[11px] text-[#64748B] mt-1 block">Abaixo do estoque mínimo</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-[#e1e7f0] shadow-xs overflow-hidden">
        {/* Location Tabs */}
        <div className="flex items-center gap-6 px-6 pt-5 border-b border-[#e1e7f0] overflow-x-auto">
          {locationTabs.map((tab) => {
            const isActive = activeLocation === tab.label;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveLocation(tab.label)}
                className={`pb-4 text-xs font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                  isActive ? "text-[#2552C8]" : "text-[#64748B] hover:text-[#141C55]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-blue-50 text-[#2552C8]" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2552C8]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto, lote ou fornecedor"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-[#2552C8] bg-gray-50/50"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Filter size={14} className="text-gray-400" />
              <span>{selectedCategory}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
            >
              <option value="Todas">Situação</option>
              <option value="Em dia">Em dia</option>
              <option value="Vence em 2 dias">Vence em 2 dias</option>
              <option value="Vencido">Vencido</option>
              <option value="Estoque baixo">Estoque baixo</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-3 px-6">Produto / Lote</th>
                <th className="py-3 px-6">Local</th>
                <th className="py-3 px-6">Quantidade</th>
                <th className="py-3 px-6">Validade</th>
                <th className="py-3 px-6">Situação</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Nenhum produto ou lote encontrado para os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <Link
                          to={`/commercial/stock/${batch.id}`}
                          className="font-bold text-[#141C55] hover:text-[#2552C8] transition-colors"
                        >
                          {batch.name}
                        </Link>
                        <span className="text-[11px] text-[#64748B]">
                          {batch.batchCode} · {batch.supplier}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{batch.location}</td>
                    <td className="py-4 px-6 font-bold text-[#141C55]">{batch.quantity}</td>
                    <td className="py-4 px-6 text-gray-600">{batch.expiration}</td>
                    <td className="py-4 px-6">{getStatusBadge(batch.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/commercial/stock/${batch.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold text-[#2552C8] hover:bg-blue-50 transition-colors"
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
        <div className="p-4 px-6 border-t border-gray-100 flex items-center justify-between text-xs text-[#64748B]">
          <span>Mostrando {filteredBatches.length} de 486 produtos</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="p-1 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-40"
              disabled
            >
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="w-7 h-7 rounded-lg bg-[#2552C8] text-white font-bold flex items-center justify-center">
              1
            </button>
            <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 font-bold flex items-center justify-center">
              2
            </button>
            <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 font-bold flex items-center justify-center">
              3
            </button>
            <span className="px-1 text-gray-400">…</span>
            <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 font-bold flex items-center justify-center">
              49
            </button>
            <button
              type="button"
              className="p-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <CommercialAddBatchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <CommercialFilterStockModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
    </CommercialLayout>
  );
}
