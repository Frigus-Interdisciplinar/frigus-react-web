export interface RecipeIngredient {
  id: number;
  productName?: string;
  quantity?: number;
  unit?: string;
  required?: boolean;
  inStock?: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  instructions?: string;
  favorite: boolean;
  ingredients?: RecipeIngredient[];
}

export type RecipeSummary = Pick<
  Recipe,
  "id" | "name" | "favorite" | "ingredients"
>;
export interface RecipeListResult {
  recipes: RecipeSummary[];
  suggestionCount: number;
}
