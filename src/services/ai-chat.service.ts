import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import {
  aiChatInputSchema,
  aiChatResponseSchema,
  type AiChatResponse,
} from "@/schemas/ai-chat.schema";
import { validateForm } from "@/utils/validation.util";

export async function sendAiChatMessage(
  input: {
    message: string;
    stockId: number;
    sessionId?: string;
  },
  signal?: AbortSignal,
): Promise<AiChatResponse> {
  const body = validateForm(aiChatInputSchema, input);
  return serviceCall(async () =>
    validateForm(
      aiChatResponseSchema,
      await api.post<unknown>("/web/core/ai/recipes/chat", body, {
        signal,
        timeout: 120_000,
      }),
    ),
  );
}
