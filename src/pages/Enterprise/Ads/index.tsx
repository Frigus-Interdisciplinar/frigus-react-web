import { useState } from "react";
import { Plus, Search, Megaphone, CheckCircle2, PauseCircle, FileEdit } from "lucide-react";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import {
  EnterpriseCreateAdModal,
  EnterpriseEditAdModal,
  EnterprisePauseAdModal,
  EnterpriseFinishAdModal,
} from "@/components/EnterpriseModals";

export default function EnterpriseAdsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "draft">("all");
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isFinishOpen, setIsFinishOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "Kit brunch artesanal",
    category: "Congelados",
    price: "R$ 21,90",
  });

  const ads = [
    {
      id: "ad-1",
      name: "Kit brunch artesanal",
      category: "Congelados",
      price: "R$ 21,90",
      views: "31,6 mil",
      status: "active",
      statusLabel: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      id: "ad-2",
      name: "Leite de amêndoas 1 L",
      category: "Bebidas",
      price: "R$ 6,49",
      views: "24,8 mil",
      status: "active",
      statusLabel: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      id: "ad-3",
      name: "Omelete de espinafre",
      category: "Prontos",
      price: "R$ 14,90",
      views: "19,7 mil",
      status: "paused",
      statusLabel: "Pausado",
      statusColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    },
    {
      id: "ad-4",
      name: "Tomate-cereja premium",
      category: "Hortifruti",
      price: "R$ 8,90",
      views: "15,4 mil",
      status: "active",
      statusLabel: "Ativo",
      statusColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    },
    {
      id: "ad-5",
      name: "Wrap de falafel",
      category: "Padaria",
      price: "R$ 11,50",
      views: "12,2 mil",
      status: "draft",
      statusLabel: "Rascunho",
      statusColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    },
  ];

  const filteredAds = ads.filter((ad) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
        ? ad.status === "active"
        : filter === "paused"
        ? ad.status === "paused"
        : ad.status === "draft";

    const matchesSearch =
      ad.name.toLowerCase().includes(search.toLowerCase()) ||
      ad.category.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleEdit = (ad: { name: string; category: string; price: string }) => {
    setSelectedProduct(ad);
    setIsEditOpen(true);
  };

  const handlePause = (ad: { name: string; category: string; price: string }) => {
    setSelectedProduct(ad);
    setIsPauseOpen(true);
  };

  const handleFinish = (ad: { name: string; category: string; price: string }) => {
    setSelectedProduct(ad);
    setIsFinishOpen(true);
  };

  return (
    <EnterpriseLayout
      activeSection="ads"
      breadcrumb="Área empresarial    /    Produtos anunciados"
      onOpenCreateAd={() => setIsCreateOpen(true)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-[#141C55] dark:text-white">
            Produtos anunciados
          </h1>
          <p className="text-xs text-[#64748B] dark:text-neutral-400 mt-1">
            Organize anúncios ativos e rascunhos sem perder o desempenho de vista.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2552C8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={16} />
          <span>Novo anúncio</span>
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1E22] p-4 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2552C8] dark:text-blue-400 flex items-center justify-center font-bold">
            <Megaphone size={18} />
          </div>
          <div>
            <p className="text-xl font-bold font-montserrat text-[#141C55] dark:text-white">23</p>
            <span className="text-[11px] text-[#64748B] dark:text-neutral-400">Produtos cadastrados</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-4 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xl font-bold font-montserrat text-[#141C55] dark:text-white">18</p>
            <span className="text-[11px] text-[#64748B] dark:text-neutral-400">Ativos em exibição</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-4 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <PauseCircle size={18} />
          </div>
          <div>
            <p className="text-xl font-bold font-montserrat text-[#141C55] dark:text-white">3</p>
            <span className="text-[11px] text-[#64748B] dark:text-neutral-400">Pausados fora de exibição</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] p-4 rounded-2xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <FileEdit size={18} />
          </div>
          <div>
            <p className="text-xl font-bold font-montserrat text-[#141C55] dark:text-white">2</p>
            <span className="text-[11px] text-[#64748B] dark:text-neutral-400">Rascunhos a concluir</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-[#E1E7F0] dark:border-[#343941] shadow-xs p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto ou categoria..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F8FC] dark:bg-[#252A32] border border-[#E1E7F0] dark:border-[#343941] text-xs font-medium text-[#141C55] dark:text-white placeholder-[#64748B] dark:placeholder-neutral-500 focus:outline-hidden focus:border-[#2552C8]"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filter === "all"
                  ? "bg-[#2552C8] text-white"
                  : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              Todos 23
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filter === "active"
                  ? "bg-[#2552C8] text-white"
                  : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              Ativos 18
            </button>
            <button
              type="button"
              onClick={() => setFilter("paused")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filter === "paused"
                  ? "bg-[#2552C8] text-white"
                  : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              Pausados 3
            </button>
            <button
              type="button"
              onClick={() => setFilter("draft")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filter === "draft"
                  ? "bg-[#2552C8] text-white"
                  : "bg-[#F5F8FC] dark:bg-[#252A32] text-[#64748B] dark:text-neutral-400 hover:text-[#141C55] dark:hover:text-white"
              }`}
            >
              Rascunhos 2
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-[#343941] text-[10px] font-bold text-[#64748B] dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Produto</th>
                <th className="py-2.5 px-3">Preço</th>
                <th className="py-2.5 px-3">Visualizações</th>
                <th className="py-2.5 px-3">Situação</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#343941]">
              {filteredAds.map((ad) => (
                <tr
                  key={ad.id}
                  className="hover:bg-gray-50/70 dark:hover:bg-[#252A32]/50 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <p className="font-bold text-[#141C55] dark:text-white">
                      {ad.name}
                    </p>
                    <p className="text-[11px] text-[#64748B] dark:text-neutral-400">
                      {ad.category}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#141C55] dark:text-white">
                    {ad.price}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[#141C55] dark:text-white">
                    {ad.views}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ad.statusColor}`}
                    >
                      {ad.statusLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      {ad.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => handleFinish(ad)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#2552C8] text-white hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Continuar
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(ad)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#2552C8] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePause(ad)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            {ad.status === "active" ? "Pausar" : "Reativar"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EnterpriseCreateAdModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EnterpriseEditAdModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={{
          name: selectedProduct.name,
          category: selectedProduct.category,
          price: selectedProduct.price,
          startDate: "01/09/2026",
          endDate: "30/09/2026",
          description: "Produto em exibição promocional na rede de lojas e aplicativo parceiro.",
        }}
      />
      <EnterprisePauseAdModal
        isOpen={isPauseOpen}
        onClose={() => setIsPauseOpen(false)}
        product={selectedProduct}
      />
      <EnterpriseFinishAdModal
        isOpen={isFinishOpen}
        onClose={() => setIsFinishOpen(false)}
        product={selectedProduct}
      />
    </EnterpriseLayout>
  );
}
