import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { listRecipes, toggleRecipeFavorite } from "@/services/recipe.service";

type RecipeCard = {
  id: string;
  title: string;
  category: string;
  time: string;
  availableIngredients: string;
  image: string;
  favorite: boolean;
  available: number;
  total: number;
};

export default function RecipePage() {
  const [search, setSearch] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    void listRecipes({ search, favoritesOnly }).then(({ recipes: data, suggestionCount: count }) => {
      if (!active) return;
      setRecipes(data.map((recipe) => {
        const available = recipe.ingredients?.filter((ingredient) => ingredient.inStock).length ?? 0;
        const total = recipe.ingredients?.length ?? 0;
        return { id: String(recipe.id), title: recipe.name, category: "Receita", time: "Tempo não informado", availableIngredients: `${available} de ${total} ingredientes disponíveis`, image: "", favorite: recipe.favorite, available, total };
      }));
      setSuggestionCount(count);
    }).catch(() => active && setError("Não foi possível carregar as receitas."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [search, favoritesOnly]);

  const toggleFavorite = async (recipe: RecipeCard) => {
    try {
      await toggleRecipeFavorite(Number(recipe.id), recipe.favorite);
      setRecipes((current) => current.map((item) => item.id === recipe.id ? { ...item, favorite: !item.favorite } : item));
    } catch { setError("Não foi possível atualizar a receita favorita."); }
  };

  const visibleRecipes = recipes.filter((recipe) => !onlyAvailable || recipe.available === recipe.total);

  return (
    <AppLayout activeSection="recipe">
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Receitas
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1 font-sans">
              Ideias para aproveitar melhor o que já existe na sua casa
            </p>
          </div>

          <button onClick={() => setFavoritesOnly((value) => !value)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22] text-xs font-bold text-frigus-navy dark:text-white hover:bg-gray-50 dark:hover:bg-[#252A32] shadow-xs transition-colors self-start sm:self-auto cursor-pointer">
            <Star size={15} className="text-amber-500 fill-amber-500" />
            <span>{favoritesOnly ? "Todas as receitas" : "Favoritas"}</span>
          </button>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-4 md:p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar receita por nome"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs focus:outline-hidden focus:border-frigus-primary dark:focus:border-[#5B89F7] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-500 bg-gray-50/50 dark:bg-[#252A32] text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer">
                <span>Categoria</span>
                <ChevronDown size={14} className="text-gray-400 dark:text-neutral-400" />
              </button>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-semibold text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-[#252A32] transition-colors cursor-pointer">
                <span>Tempo de preparo</span>
                <ChevronDown size={14} className="text-gray-400 dark:text-neutral-400" />
              </button>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-neutral-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded-md border-gray-300 dark:border-neutral-600 text-frigus-primary focus:ring-frigus-primary/20 w-4 h-4 bg-white dark:bg-[#1C1E22]"
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
              Encontramos {suggestionCount} receitas sugeridas pela API
            </p>
            <div className="pt-2">
              <Link
                to={recipes[0] ? `/recipe/${recipes[0].id}` : "/recipe"}
                className="inline-flex items-center gap-2 bg-frigus-accent hover:bg-[#F2BD50] text-frigus-navy px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span>Ver sugestões</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-64 h-36 rounded-2xl overflow-hidden shadow-md border-2 border-white/20 bg-linear-to-br from-emerald-400/70 to-amber-300/70" aria-hidden="true" />
        </div>

        {/* Itens para Aproveitar */}
        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Sparkles size={16} />
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm">
                Itens para aproveitar
              </h3>
            </div>
            <p className="text-xs text-gray-400 dark:text-neutral-400">Estão próximos do vencimento</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-xs rounded-xl border border-amber-200 dark:border-amber-800">
              Alertas reais estão na área de Alertas
            </span>
            <Link
              to="/alerts"
              className="text-xs font-bold text-frigus-primary dark:text-[#5B89F7] hover:underline ml-2"
            >
              Ver todos os alertas
            </Link>
          </div>
        </div>

        {/* Grid de Receitas Recomendadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-lg">
                Receitas recomendadas
              </h3>
              <p className="text-xs text-gray-400 dark:text-neutral-400">
                Baseadas nos ingredientes disponíveis agora
              </p>
            </div>
            <span className="text-xs font-bold text-frigus-primary dark:text-[#5B89F7] cursor-pointer hover:underline">
              Ver catálogo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            {loading && <p className="text-sm text-gray-500">Carregando receitas…</p>}
            {!loading && visibleRecipes.length === 0 && <p className="text-sm text-gray-500">Nenhuma receita encontrada.</p>}
            {visibleRecipes.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-[#1C1E22] rounded-3xl border border-gray-200/80 dark:border-[#343941] shadow-xs overflow-hidden flex flex-col justify-between group hover:border-frigus-primary/40 dark:hover:border-[#5B89F7]/40 transition-all hover:shadow-md"
              >
                <div>
                  <div className="h-44 overflow-hidden relative bg-linear-to-br from-[#131C55] to-[#2552C8] flex items-end p-5">
                    <p className="text-white font-montserrat font-bold text-lg">{rec.title}</p>
                    <div className="absolute top-3 left-3">
                      <Badge variant="accent">{rec.category}</Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-400 dark:text-neutral-400">
                      <Clock size={14} />
                      <span>{rec.time}</span>
                      <button type="button" aria-label={rec.favorite ? "Remover das favoritas" : "Adicionar às favoritas"} onClick={() => void toggleFavorite(rec)}><Star size={15} className={rec.favorite ? "fill-amber-400 text-amber-500" : ""} /></button>
                    </div>
                    <h4 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base group-hover:text-frigus-primary dark:group-hover:text-[#5B89F7] transition-colors">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {rec.availableIngredients}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/recipe/${rec.id}`}
                    className="w-full py-2.5 px-4 bg-frigus-navy dark:bg-frigus-primary hover:bg-slate-900 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center block transition-colors shadow-xs"
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
