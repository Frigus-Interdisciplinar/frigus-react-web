import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import {
  recipeResponseSchema,
  recipeSummaryResponseSchema,
} from "@/schemas/api-response.schema";
import { validateForm } from "@/utils/validation.util";
import { z } from "zod";
import type { Recipe, RecipeListResult } from "@/types/recipe.type";
export type {
  Recipe,
  RecipeIngredient,
  RecipeListResult,
  RecipeSummary,
} from "@/types/recipe.type";

export async function getRecipe(
  id: number,
  signal?: AbortSignal,
): Promise<Recipe> {
  return serviceCall(async () =>
    validateForm(
      recipeResponseSchema,
      await api.get<unknown>(
        `/web/core/recipes/${id}`,
        signal ? { signal } : undefined,
      ),
    ),
  );
}

export function listRecipes(
  options: { search?: string; favoritesOnly?: boolean } = {},
  signal?: AbortSignal,
): Promise<RecipeListResult> {
  return serviceCall(async () => {
    const { search, favoritesOnly = false } = options;
    const path = favoritesOnly
      ? "/web/core/recipes/favorites?page=0&size=100"
      : `/web/core/recipes?page=0&size=100${search ? `&name=${encodeURIComponent(search)}` : ""}`;
    const [page, suggestions] = await Promise.all([
      api.get<unknown>(path, { signal }),
      api.get<unknown>("/web/core/recipes/suggestions?limit=20", { signal }),
    ]);
    const recipePage = validateForm(
      z.object({ content: z.array(recipeSummaryResponseSchema) }),
      page,
    );
    const parsedSuggestions = validateForm(
      z.array(z.object({ recipe: recipeSummaryResponseSchema })),
      suggestions,
    );
    return {
      recipes: recipePage.content,
      suggestionCount: parsedSuggestions.length,
    };
  });
}

export async function toggleRecipeFavorite(
  id: number,
  favorite: boolean,
): Promise<void> {
  return serviceCall(async () => {
    if (favorite) await api.delete<void>(`/web/core/recipes/${id}/favorite`);
    else await api.put<void>(`/web/core/recipes/${id}/favorite`, undefined);
  });
}
