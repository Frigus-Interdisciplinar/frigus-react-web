import { z } from "zod";
import { optionalText, positiveId, requiredText } from "./common.schema";

export const aiChatInputSchema = z.object({
  message: requiredText("Mensagem", 4000),
  stockId: positiveId,
  sessionId: optionalText(200),
});

export const aiChatResponseSchema = z.object({
  sessionId: z.string().nullable().optional(),
  chatMessage: z.string().nullable().optional(),
  recipeId: z.number().nullable().optional(),
  recipeName: z.string().nullable().optional(),
  recipeDescription: z.string().nullable().optional(),
  recipeInstructions: z.string().nullable().optional(),
  matchedIngredients: z.number().nullable().optional(),
  missingIngredients: z.number().nullable().optional(),
});

export type AiChatResponse = z.infer<typeof aiChatResponseSchema>;
