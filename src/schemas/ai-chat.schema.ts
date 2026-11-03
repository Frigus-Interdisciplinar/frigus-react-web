import { z } from "zod";
import { optionalText, positiveId, requiredText } from "./common.schema";
import type { AiChatResponse } from "@/types/ai-chat.type";
export type { AiChatResponse } from "@/types/ai-chat.type";

export const aiChatInputSchema = z.object({
  message: requiredText("Mensagem", 4000),
  stockId: positiveId,
  sessionId: optionalText(200),
});

export const aiChatResponseSchema: z.ZodType<AiChatResponse> = z.object({
  sessionId: z.string().nullable().optional(),
  chatMessage: z.string().nullable().optional(),
  recipeId: z.number().nullable().optional(),
  recipeName: z.string().nullable().optional(),
  recipeDescription: z.string().nullable().optional(),
  recipeInstructions: z.string().nullable().optional(),
  matchedIngredients: z.number().nullable().optional(),
  missingIngredients: z.number().nullable().optional(),
});
