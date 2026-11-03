export interface AiChatResponse {
  sessionId?: string | null;
  chatMessage?: string | null;
  recipeId?: number | null;
  recipeName?: string | null;
  recipeDescription?: string | null;
  recipeInstructions?: string | null;
  matchedIngredients?: number | null;
  missingIngredients?: number | null;
}
