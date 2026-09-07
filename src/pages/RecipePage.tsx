import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";
import Badge from "@/components/Common/Badge";

type RecipeCard = {
  id: string;
  title: string;
  category: string;
  time: string;
  availableIngredients: string;
  image: string;
};

const recipes: RecipeCard[] = [
  {
    id: "1",
    title: "Omelete de tomate",
    category: "Café da manhã",
    time: "15 min",
    availableIngredients: "4 de 5 ingredientes disponíveis",
    image: "/images/omelete.png",
  },
  {
    id: "2",
    title: "Arroz cremoso de legumes",
    category: "Almoço",
    time: "25 min",
    availableIngredients: "5 de 7 ingredientes disponíveis",
    image: "/images/arroz-cremoso.png",
  },
  {
    id: "3",
    title: "Frango com legumes",
    category: "Jantar",
    time: "35 min",
    availableIngredients: "3 de 4 ingredientes disponíveis",
    image: "/images/frango-legumes.png",
  },
];

export default function RecipePage() {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  return (
    <AppLayout activeSection="recipe">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
              Receitas
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-sans">
              Ideias para aproveitar melhor o que já existe na sua casa
            </p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-frigus-navy hover:bg-gray-50 shadow-xs transition-colors self-start sm:self-auto">
            <Star size={15} className="text-amber-500 fill-amber-500" />
            <span>Favoritas</span>
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar receita por nome"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-frigus-primary transition-all placeholder:text-gray-400 bg-gray-50/50"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <span>Categoria</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                <span>Tempo de preparo</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded-md border-gray-300 text-frigus-primary focus:ring-frigus-primary/20 w-4 h-4"
                />
                <span>Só com meu estoque</span>
              </label>
            </div>
          </div>
        </div>

        {/* Hero Banner: Sugestão para hoje */}
        <div className="bg-frigus-primary rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="relative z-10 space-y-3 max-w-lg">
            <span className="text-[11px] uppercase tracking-wider font-bold text-frigus-ice font-sans">
              Sugestão para hoje
            </span>
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl leading-tight">
              Cozinhe com o que você já tem
            </h2>
            <p className="text-frigus-ice text-sm font-sans leading-relaxed">
              Encontramos 8 receitas com ingredientes disponíveis no seu estoque
            </p>
            <div className="pt-2">
              <Link
                to="/recipe/1"
                className="inline-flex items-center gap-2 bg-frigus-accent hover:bg-[#F2BD50] text-frigus-navy px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span>Ver sugestões</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-64 h-36 rounded-2xl overflow-hidden shadow-md border-2 border-white/20">
            <img
              src="/images/omelete-tomate.png"
              alt="Prato do dia"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Itens para Aproveitar */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-amber-600">
              <Sparkles size={16} />
              <h3 className="font-montserrat font-bold text-frigus-navy text-sm">
                Itens para aproveitar
              </h3>
            </div>
            <p className="text-xs text-gray-400">Estão próximos do vencimento</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-amber-200">
              Tomate (6 un.)
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-amber-200">
              Ovos (4 un.)
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-xl border border-amber-200">
              Iogurte (3 un.)
            </span>
            <Link
              to="/alerts"
              className="text-xs font-bold text-frigus-primary hover:underline ml-2"
            >
              Ver todos os alertas
            </Link>
          </div>
        </div>

        {/* Grid de Receitas Recomendadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy text-lg">
                Receitas recomendadas
              </h3>
              <p className="text-xs text-gray-400">
                Baseadas nos ingredientes disponíveis agora
              </p>
            </div>
            <span className="text-xs font-bold text-frigus-primary cursor-pointer hover:underline">
              Ver catálogo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipes.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-frigus-primary/40 transition-all hover:shadow-md"
              >
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="accent">{rec.category}</Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={14} />
                      <span>{rec.time}</span>
                    </div>
                    <h4 className="font-montserrat font-bold text-frigus-navy text-base group-hover:text-frigus-primary transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-emerald-600 font-medium">
                      {rec.availableIngredients}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/recipe/${rec.id}`}
                    className="w-full py-2.5 px-4 bg-frigus-navy hover:bg-slate-900 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-xs"
                  >
                    Ver receita
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
