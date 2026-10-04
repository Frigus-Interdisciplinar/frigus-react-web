import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, Package, ChevronRight, Utensils } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge, { type BadgeVariant } from "@/components/Badge";

type AlertItem = {
  id: string;
  name: string;
  detail: string;
  badge: string;
  badgeVariant: BadgeVariant;
  image?: string;
  type: "Validade" | "Quantidade" | "Vencidos";
};

const alertItems: AlertItem[] = [
  {
    id: "2",
    name: "Tomate italiano",
    detail: "6 unidades • Geladeira",
    badge: "Vence amanhã",
    badgeVariant: "warning",
    image: "/images/food-tomate.png",
    type: "Validade",
  },
  {
    id: "6",
    name: "Iogurte natural",
    detail: "3 unidades • Geladeira",
    badge: "Vencido há 1 dia",
    badgeVariant: "danger",
    image: "/images/food-iogurte.png",
    type: "Vencidos",
  },
  {
    id: "7",
    name: "Ovos brancos",
    detail: "4 unidades • Geladeira",
    badge: "Vence em 2 dias",
    badgeVariant: "warning",
    type: "Validade",
  },
  {
    id: "8",
    name: "Azeite de oliva",
    detail: "Restam 120 ml • Despensa",
    badge: "Quantidade baixa",
    badgeVariant: "info",
    type: "Quantidade",
  },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState<"Todos" | "Validade" | "Quantidade" | "Vencidos">("Todos");

  const filtered = alertItems.filter(
    (item) => filter === "Todos" || item.type === filter
  );

  return (
    <AppLayout activeSection="alerts">
      <div className="space-y-6">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Alertas
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Confira o que precisa de atenção para evitar desperdícios
            </p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
            11 alertas ativos
          </span>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Próximos do vencimento */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex items-center justify-between hover:border-amber-300 dark:hover:border-amber-600 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Clock size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Próximos do vencimento
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Consuma nos próximos 3 dias</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-frigus-navy dark:text-white">
              6
            </span>
          </div>

          {/* Produtos vencidos */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex items-center justify-between hover:border-red-300 dark:hover:border-red-600 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                <AlertTriangle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Produtos vencidos
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Retire ou descarte do estoque</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-red-600 dark:text-red-400">
              2
            </span>
          </div>

          {/* Estoque baixo */}
          <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-frigus-primary dark:text-[#5B89F7]">
                <Package size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Estoque baixo
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Inclua na lista de compras</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-frigus-navy dark:text-white">
              3
            </span>
          </div>
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-gray-400 dark:text-neutral-400 font-medium mr-2">Filtrar por:</span>
          {(["Todos", "Validade", "Quantidade", "Vencidos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-frigus-primary text-white shadow-xs"
                  : "bg-white dark:bg-[#1C1E22] text-gray-600 dark:text-neutral-300 border border-gray-200 dark:border-[#343941] hover:border-gray-300 dark:hover:border-neutral-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista de Alertas + Sugestão de Receita Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista (8 colunas) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Itens que precisam da sua atenção
              </h3>
              <span className="text-xs font-bold text-gray-400 dark:text-neutral-400">
                {filtered.length} itens listados
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-[#343941]">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover border border-gray-100 dark:border-[#343941] bg-gray-50 dark:bg-gray-800"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-frigus-primary dark:text-[#A7BCFF] font-bold flex items-center justify-center text-xs">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-frigus-navy dark:text-white text-sm group-hover:text-frigus-primary dark:group-hover:text-[#5B89F7] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-neutral-400">{item.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                    <Link
                      to={`/stock/${item.id}`}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors"
                    >
                      Ver item
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sugestão de Receita (4 colunas) */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-frigus-primary dark:text-[#5B89F7] mb-1">
                <Utensils size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aproveite seus alimentos
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
                Receitas para reduzir o desperdício
              </h3>
              <p className="text-xs text-gray-400 dark:text-neutral-400 mt-1">
                Use os ingredientes que estão vencendo primeiro.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-[#343941] overflow-hidden bg-gray-50/50 dark:bg-[#252A32]">
              <img
                src="/images/omelete.png"
                alt="Omelete de tomate"
                className="w-full h-36 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">Café da manhã</Badge>
                  <span className="text-xs text-gray-400 dark:text-neutral-400">15 min • 2 porções</span>
                </div>
                <h4 className="font-bold text-frigus-navy dark:text-white text-sm">
                  Omelete de tomate
                </h4>
                <p className="text-xs text-gray-500 dark:text-neutral-300 leading-relaxed">
                  Aproveita os tomates da geladeira que vencem amanhã.
                </p>
                <Link
                  to="/recipe/1"
                  className="inline-flex items-center justify-center gap-2 w-full mt-2 py-2 px-3 bg-frigus-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <span>Ver receita completa</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
