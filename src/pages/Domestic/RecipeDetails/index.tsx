import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Bookmark, ChefHat, Check, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { getRecipe, toggleRecipeFavorite, type Recipe } from "@/services/recipe.service";

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [updatedRecipe, setUpdatedRecipe] = useState<Recipe>();
  const validId = id !== undefined && /^[1-9]\d*$/.test(id);
  const { data: loadedRecipe, loading, error: loadError } = useAbortableAsync(
    (signal) => {
      if (!validId || !id) return Promise.reject(new Error("Receita inválida."));
      return getRecipe(Number(id), signal);
    },
    [id, validId],
  );
  const recipe = updatedRecipe ?? loadedRecipe;
  const [actionError, setActionError] = useState("");
  const error = actionError || loadError;

  const toggleFavorite = async () => {
    if (!recipe) return;
    try {
      await toggleRecipeFavorite(recipe.id, recipe.favorite);
      setUpdatedRecipe({ ...recipe, favorite: !recipe.favorite });
    } catch { setActionError("Não foi possível atualizar as favoritas."); }
  };

  const ingredients = recipe?.ingredients ?? [];
  const availableCount = ingredients.filter((item) => item.inStock).length;
  const steps = (recipe?.instructions ?? "").split(/\r?\n/).map((step) => step.trim()).filter(Boolean);

  return (
    <AppLayout activeSection="recipe">
      <div className="space-y-6">
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="py-8 text-sm text-gray-500">Carregando receita…</p> : recipe && <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1"><Link to="/recipe">Receitas</Link><ChevronRight size={12} /><span>{recipe.name}</span></div><h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">{recipe.name}</h1></div>
            <button type="button" onClick={() => void toggleFavorite()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold dark:bg-[#1C1E22] dark:border-[#343941]"><Bookmark size={15} className={recipe.favorite ? "fill-amber-500 text-amber-500" : ""} />{recipe.favorite ? "Salva" : "Salvar"}</button>
          </div>

          <section className="rounded-3xl overflow-hidden border border-gray-200 dark:border-[#343941] bg-white dark:bg-[#1C1E22]">
            <div className="min-h-64 bg-linear-to-br from-[#131C55] via-[#1E2C7A] to-[#2552C8] flex items-end p-7 sm:p-9"><div className="max-w-3xl text-white"><Badge variant="accent">Receita</Badge><h2 className="mt-3 font-montserrat font-bold text-2xl sm:text-3xl">{recipe.name}</h2><p className="mt-2 text-sm text-blue-100">{recipe.description || "Sem descrição adicional."}</p></div></div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-4"><div className="rounded-xl bg-gray-50 dark:bg-[#252A32] p-4"><span className="text-[10px] uppercase text-gray-500">Ingredientes em casa</span><p className="font-bold text-frigus-navy dark:text-white">{availableCount} / {ingredients.length}</p></div><div className="rounded-xl bg-gray-50 dark:bg-[#252A32] p-4"><span className="text-[10px] uppercase text-gray-500">Porções</span><p className="font-bold text-frigus-navy dark:text-white">Não informado</p></div><div className="rounded-xl bg-gray-50 dark:bg-[#252A32] p-4"><span className="text-[10px] uppercase text-gray-500">Tempo</span><p className="font-bold text-frigus-navy dark:text-white">Não informado</p></div></div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-5 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200 dark:border-[#343941] space-y-4"><div><h3 className="font-montserrat font-bold text-frigus-navy dark:text-white">Ingredientes</h3><p className="text-xs text-gray-500 mt-1">{availableCount} de {ingredients.length} disponíveis no estoque.</p></div>{ingredients.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#252A32]"><div className="flex items-center gap-2">{item.inStock ? <Check size={15} className="text-emerald-600" /> : <AlertCircle size={15} className="text-amber-600" />}<span className="text-xs font-semibold text-frigus-navy dark:text-white">{item.productName ?? "Ingrediente"}</span></div><span className="text-xs text-gray-500">{item.quantity ?? ""} {item.unit ?? ""}</span></div>)}{ingredients.length === 0 && <p className="text-sm text-gray-500">Esta receita ainda não tem ingredientes cadastrados.</p>}</section>
            <section className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200 dark:border-[#343941] space-y-4"><div className="flex items-center gap-2"><ChefHat size={18} className="text-frigus-primary" /><h3 className="font-montserrat font-bold text-frigus-navy dark:text-white">Modo de preparo</h3></div>{steps.length ? steps.map((step, index) => <div key={`${index}-${step}`} className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-[#252A32]"><span className="size-7 rounded-lg bg-frigus-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{index + 1}</span><p className="text-sm text-gray-700 dark:text-gray-200">{step}</p></div>) : <p className="text-sm text-gray-500">Modo de preparo não cadastrado.</p>}</section>
          </div>
        </>}
      </div>
    </AppLayout>
  );
}
