import { z } from "zod";
import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import type { ChatMessage, Conversation } from "@/types/chat.type";
export type { ChatMessage, Conversation } from "@/types/chat.type";
import { chatMessageSchema } from "@/schemas/chat.schema";
import { validateForm } from "@/utils/validation.util";
import {
  chatMessageResponseSchema,
  conversationResponseSchema,
} from "@/schemas/api-response.schema";

export function listConversations(
  signal?: AbortSignal,
): Promise<Conversation[]> {
  return serviceCall(async () =>
    validateForm(
      z.array(conversationResponseSchema),
      await api.get<unknown>("/web/core/chat/conversations", { signal }),
    ),
  );
}

export function listMessages(
  conversationId: string,
  signal?: AbortSignal,
): Promise<ChatMessage[]> {
  return serviceCall(async () => {
    const page = await api.get<unknown>(
      `/web/core/chat/conversations/${encodeURIComponent(conversationId)}/messages?size=100&sort=createdAt,desc`,
      { signal },
    );
    return validateForm(
      z.object({ content: z.array(chatMessageResponseSchema) }),
      page,
    ).content.reverse();
  });
}

export function sendMessage(
  conversationId: string,
  content: string,
  signal?: AbortSignal,
): Promise<ChatMessage> {
  const validatedInput = validateForm(chatMessageSchema, { content });
  return serviceCall(async () =>
    validateForm(
      chatMessageResponseSchema,
      await api.post<unknown>(
        `/web/core/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
        {
          content: validatedInput.content,
          messageType: "TEXT",
        },
        { signal },
      ),
    ),
  );
}
