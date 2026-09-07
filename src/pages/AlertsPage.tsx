import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, Package, ChevronRight, Utensils } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge, { type BadgeVariant } from "@/components/Common/Badge";

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
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Alertas
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Confira o que precisa de atenção para evitar desperdícios
            </p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
            11 alertas ativos
          </span>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Próximos do vencimento */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex items-center justify-between hover:border-amber-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Próximos do vencimento
                </span>
              </div>
              <p className="text-xs text-gray-500">Consuma nos próximos 3 dias</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-frigus-navy">
              6
            </span>
          </div>

          {/* Produtos vencidos */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex items-center justify-between hover:border-red-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Produtos vencidos
                </span>
              </div>
              <p className="text-xs text-gray-500">Retire ou descarte do estoque</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-red-600">
              2
            </span>
          </div>

          {/* Estoque baixo */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex items-center justify-between hover:border-blue-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-frigus-primary">
                <Package size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Estoque baixo
                </span>
              </div>
              <p className="text-xs text-gray-500">Inclua na lista de compras</p>
            </div>
            <span className="font-montserrat font-bold text-3xl text-frigus-navy">
              3
            </span>
          </div>
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-gray-400 font-medium mr-2">Filtrar por:</span>
          {(["Todos", "Validade", "Quantidade", "Vencidos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? "bg-frigus-primary text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Lista de Alertas + Sugestão de Receita Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lista (8 colunas) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Itens que precisam da sua atenção
              </h3>
              <span className="text-xs font-bold text-gray-400">
                {filtered.length} itens listados
              </span>
            </div>

            <div className="divide-y divide-gray-100">
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
                        className="w-11 h-11 rounded-xl object-cover border border-gray-100 bg-gray-50"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-frigus-primary font-bold flex items-center justify-center text-xs">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-frigus-navy text-sm group-hover:text-frigus-primary transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400">{item.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={item.badgeVariant}>{item.badge}</Badge>
                    <Link
                      to={`/stock/${item.id}`}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-frigus-navy hover:bg-gray-50 transition-colors"
                    >
                      Ver item
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sugestão de Receita (4 colunas) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-frigus-primary mb-1">
                <Utensils size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aproveite seus alimentos
                </span>
              </div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-base">
                Receitas para reduzir o desperdício
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Use os ingredientes que estão vencendo primeiro.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden bg-gray-50/50">
              <img
                src="/images/omelete.png"
                alt="Omelete de tomate"
                className="w-full h-36 object-cover"
              />
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">Café da manhã</Badge>
                  <span className="text-xs text-gray-400">15 min • 2 porções</span>
                </div>
                <h4 className="font-bold text-frigus-navy text-sm">
                  Omelete de tomate
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
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
