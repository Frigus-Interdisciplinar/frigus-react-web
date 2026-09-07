import { useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import AddItemModal from "@/components/Common/AddItemModal";

type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  checked: boolean;
  image?: string;
};

const initialItems: ShoppingItem[] = [
  {
    id: "1",
    name: "Queijo muçarela",
    category: "Laticínios",
    quantity: "40 g",
    checked: false,
  },
  {
    id: "2",
    name: "Tomate italiano",
    category: "Hortifruti",
    quantity: "6 un",
    checked: false,
    image: "/images/food-tomate.png",
  },
  {
    id: "3",
    name: "Café em pó",
    category: "Mercearia",
    quantity: "1 pct",
    checked: false,
  },
  {
    id: "4",
    name: "Macarrão penne",
    category: "Mercearia",
    quantity: "2 pct",
    checked: false,
  },
  {
    id: "5",
    name: "Banana prata",
    category: "Hortifruti",
    quantity: "6 un",
    checked: false,
    image: "/images/food-banana.png",
  },
  {
    id: "6",
    name: "Feijão carioca",
    category: "Mercearia",
    quantity: "1 pct",
    checked: false,
    image: "/images/food-feijao.png",
  },
  {
    id: "7",
    name: "Detergente líquido",
    category: "Limpeza",
    quantity: "2 un",
    checked: true,
  },
  {
    id: "8",
    name: "Pão de forma",
    category: "Padaria",
    quantity: "1 pct",
    checked: true,
  },
];

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<"pendentes" | "comprados">("pendentes");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const pendingItems = items.filter((item) => !item.checked);
  const completedItems = items.filter((item) => item.checked);

  return (
    <AppLayout activeSection="shopping-list">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Lista de compras
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Organize o que está faltando e marque os itens quando comprar
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-frigus-primary hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>Adicionar itens</span>
          </button>
        </div>

        {/* Faixa de Alerta: Itens em falta */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              3 itens em falta no estoque precisam de reposição urgente
            </span>
          </div>
          <span className="text-xs font-bold text-amber-700 hover:underline cursor-pointer">
            Ver estoque
          </span>
        </div>

        {/* Abas e Filtros */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-gray-100/80 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("pendentes")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "pendentes"
                  ? "bg-white text-frigus-navy shadow-xs"
                  : "text-gray-500 hover:text-frigus-navy"
              }`}
            >
              Pendentes ({pendingItems.length})
            </button>
            <button
              onClick={() => setActiveTab("comprados")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "comprados"
                  ? "bg-white text-frigus-navy shadow-xs"
                  : "text-gray-500 hover:text-frigus-navy"
              }`}
            >
              Comprados ({completedItems.length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <span>Todas as categorias</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {completedItems.length > 0 && (
              <button
                onClick={() =>
                  setItems((prev) => prev.filter((item) => !item.checked))
                }
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Limpar concluídos
              </button>
            )}
          </div>
        </div>

        {/* Grid de Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista de Itens (8 colunas) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                {activeTab === "pendentes" ? "Para comprar" : "Itens comprados"}
              </h3>
              <span className="text-xs font-bold text-frigus-primary bg-blue-50 px-2.5 py-1 rounded-lg">
                {activeTab === "pendentes"
                  ? `${pendingItems.length} itens`
                  : `${completedItems.length} itens`}
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {(activeTab === "pendentes" ? pendingItems : completedItems).map(
                (item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          item.checked
                            ? "bg-frigus-primary border-frigus-primary text-white"
                            : "border-gray-300 hover:border-frigus-primary"
                        }`}
                      >
                        {item.checked && <Check size={14} strokeWidth={3} />}
                      </button>

                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover bg-gray-50 border border-gray-100"
                        />
                      )}

                      <div>
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            item.checked
                              ? "line-through text-gray-400"
                              : "text-frigus-navy"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantidade */}
                      <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-100">
                        <span className="text-xs font-bold text-frigus-navy">
                          {item.quantity}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
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
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-frigus-primary mb-1">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Sugestões para você
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Com base na sua rotina
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Alimentos que estão acabando no estoque da sua casa
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                {
                  name: "Leite integral",
                  desc: "Estoque baixo • resta 1 L",
                  letter: "L",
                },
                {
                  name: "Ovos brancos",
                  desc: "Acabando • restam 2 un.",
                  letter: "O",
                },
                {
                  name: "Azeite de oliva",
                  desc: "Estoque baixo • resta 120 ml",
                  letter: "A",
                },
              ].map((sug, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-center justify-between gap-3 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-frigus-primary font-bold text-xs flex items-center justify-center">
                      {sug.letter}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-frigus-navy">{sug.name}</p>
                      <p className="text-[10px] text-gray-400">{sug.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setItems((prev) => [
                        ...prev,
                        {
                          id: String(Date.now()),
                          name: sug.name,
                          category: "Mercearia",
                          quantity: "1 un",
                          checked: false,
                        },
                      ]);
                    }}
                    className="p-1.5 rounded-lg text-frigus-primary hover:bg-blue-50 transition-colors"
                    title="Adicionar à lista"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          // mock adding item
          setItems((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              name: "Novo item adicionado",
              category: "Mercearia",
              quantity: "1 un",
              checked: false,
            },
          ]);
        }}
      />
    </AppLayout>
  );
}
