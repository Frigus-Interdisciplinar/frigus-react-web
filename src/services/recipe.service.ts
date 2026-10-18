import { api } from "@/utils/api.util";

export type RecipeIngredient = {
  id: number;
  productName?: string;
  quantity?: number;
  unit?: string;
  required?: boolean;
  inStock?: boolean;
};
export type Recipe = {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  favorite: boolean;
  ingredients?: RecipeIngredient[];
};
export type RecipeSummary = Pick<
  Recipe,
  "id" | "name" | "favorite" | "ingredients"
>;

export async function getRecipe(
  id: number,
  signal?: AbortSignal,
): Promise<Recipe> {
  return api.get<Recipe>(
    `/web/core/recipes/${id}`,
    signal ? { signal } : undefined,
  );
}

export async function listRecipes(
  options: { search?: string; favoritesOnly?: boolean } = {},
) {
  const { search, favoritesOnly = false } = options;
  const path = favoritesOnly
    ? "/web/core/recipes/favorites?page=0&size=100"
    : `/web/core/recipes?page=0&size=100${search ? `&name=${encodeURIComponent(search)}` : ""}`;
  const [page, suggestions] = await Promise.all([
    api.get<{ content: RecipeSummary[] }>(path),
    api.get<Array<{ recipe: RecipeSummary }>>(
      "/web/core/recipes/suggestions?limit=20",
    ),
  ]);
  return { recipes: page.content, suggestionCount: suggestions.length };
}

export async function toggleRecipeFavorite(
  id: number,
  favorite: boolean,
): Promise<void> {
  if (favorite) await api.delete<void>(`/web/core/recipes/${id}/favorite`);
  else await api.put<void>(`/web/core/recipes/${id}/favorite`, undefined);
}
