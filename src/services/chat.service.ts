import { z } from "zod";
import { uuid, conversationSchema, groupConversationInputSchema, messageSchema, messageInputSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
const root = "/web/core/chat/conversations";
const path = (conversationId: string) => `${root}/${uuid.parse(conversationId)}`;
export const chatService = {
  list: () => request(z.array(conversationSchema), root),
  get: (conversationId: string) => request(conversationSchema, path(conversationId)),
  createGroup: (data: z.input<typeof groupConversationInputSchema>) => request(conversationSchema, `${root}/group`, "POST", groupConversationInputSchema.parse(data)),
  createPrivate: (targetUserId: string) => request(conversationSchema, `${root}/private`, "POST", { targetUserId: uuid.parse(targetUserId) }),
  listMessages: (conversationId: string, paging?: Paging) => request(pageSchema(messageSchema), `${path(conversationId)}/messages`, "GET", undefined, query(paging)),
  sendMessage: (conversationId: string, data: z.input<typeof messageInputSchema>) => request(messageSchema, `${path(conversationId)}/messages`, "POST", messageInputSchema.parse(data)),
};
