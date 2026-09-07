import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChevronDown } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge, { type BadgeVariant } from "@/components/Common/Badge";
import AddItemModal from "@/components/Common/AddItemModal";

type StockItem = {
  id: string;
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

const stockItems: StockItem[] = [
  {
    id: "1",
    name: "Leite integral",
    brand: "Fazenda Bela",
    category: "Laticínios",
    quantity: "2 L",
    location: "Geladeira",
    expiration: "18 ago",
    status: "Dentro do prazo",
    statusVariant: "success",
    image: "/images/food-leite.png",
  },
  {
    id: "2",
    name: "Tomate italiano",
    brand: "Hortifruti",
    category: "Vegetais",
    quantity: "6 un",
    location: "Geladeira",
    expiration: "15 ago",
    status: "Vence em breve",
    statusVariant: "warning",
    image: "/images/food-tomate.png",
  },
  {
    id: "3",
    name: "Filé de frango",
    brand: "Seara",
    category: "Carnes",
    quantity: "1,2 kg",
    location: "Freezer",
    expiration: "22 set",
    status: "Dentro do prazo",
    statusVariant: "success",
  },
  {
    id: "4",
    name: "Banana prata",
    brand: "Hortifruti",
    category: "Frutas",
    quantity: "1 dúzia",
    location: "Despensa",
    expiration: "14 ago",
    status: "Vence em breve",
    statusVariant: "warning",
    image: "/images/food-banana.png",
  },
  {
    id: "5",
    name: "Feijão carioca",
    brand: "Camil",
    category: "Mercearia",
    quantity: "2 kg",
    location: "Despensa",
    expiration: "10 nov",
    status: "Dentro do prazo",
    statusVariant: "success",
    image: "/images/food-feijao.png",
  },
  {
    id: "6",
    name: "Iogurte natural",
    brand: "Nestlé",
    category: "Laticínios",
    quantity: "3 un",
    location: "Geladeira",
    expiration: "12 ago",
    status: "Vencido",
    statusVariant: "danger",
    image: "/images/food-iogurte.png",
  },
];

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<"Todos" | "Despensa" | "Geladeira" | "Freezer">("Todos");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredItems = stockItems.filter((item) => {
    const matchesTab = activeTab === "Todos" || item.location === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <AppLayout activeSection="stock">
      <div className="space-y-6">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Estoque da casa
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Acompanhe os alimentos disponíveis em cada espaço da casa
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden md:inline">
              Atualizado hoje, 09:41
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs"
            >
              <Plus size={16} />
              <span>Adicionar item</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros e Controles */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Abas de Localização */}
            <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl w-full md:w-auto">
              {(["Todos", "Despensa", "Geladeira", "Freezer"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-white text-frigus-navy shadow-xs"
                      : "text-gray-500 hover:text-frigus-navy"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Campo de Busca */}
            <div className="relative w-full md:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar alimento"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-frigus-primary transition-all placeholder:text-gray-400 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Filtros em Dropdown */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
            <span className="text-xs text-gray-400 font-medium mr-2">Filtrar por:</span>
            {["Categoria", "Validade", "Quantidade"].map((filter) => (
              <button
                key={filter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span>{filter}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Alimentos */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Alimentos cadastrados
              </h3>
              <p className="text-xs text-gray-400">
                {filteredItems.length} de {stockItems.length} itens no espaço
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#EAF3FF] text-frigus-primary rounded-xl">
              128 itens totais
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Alimento</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Qtd.</th>
                  <th className="py-3 px-4">Local</th>
                  <th className="py-3 px-4">Validade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="py-3.5 px-4 font-bold text-frigus-navy">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-xl object-cover bg-gray-100 border border-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-frigus-primary font-bold flex items-center justify-center text-xs">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-frigus-navy text-sm">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400 font-normal">
                            {item.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs font-medium">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-frigus-navy text-xs font-bold">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {item.location}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {item.expiration}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.statusVariant}>{item.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/stock/${item.id}`}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold text-frigus-primary hover:bg-blue-50 transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Item */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar alimento ao estoque"
        subtitle="Selecione ou cadastre novos alimentos na sua despensa"
      />
    </AppLayout>
  );
}
