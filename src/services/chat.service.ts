import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { uuid, conversationSchema, groupConversationInputSchema, messageSchema, messageInputSchema, messageReactionSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
const root = "/web/core/chat/conversations";
const path = (conversationId: string) => `${root}/${uuid.parse(conversationId)}`;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const maxFileSize = 10 * 1024 * 1024;
const signedUploadSchema = z.object({ bucket: z.string(), path: z.string(), token: z.string(), fileName: z.string(), mimeType: z.string() });

export const chatService = {
  list: () => request(z.array(conversationSchema), root),
  get: (conversationId: string) => request(conversationSchema, path(conversationId)),
  createGroup: (data: z.input<typeof groupConversationInputSchema>) => request(conversationSchema, `${root}/group`, "POST", groupConversationInputSchema.parse(data)),
  createPrivate: (targetUserId: string) => request(conversationSchema, `${root}/private`, "POST", { targetUserId: uuid.parse(targetUserId) }),
  listMessages: (conversationId: string, paging?: Paging, search?: string) => request(pageSchema(messageSchema), `${path(conversationId)}/messages`, "GET", undefined, { ...query(paging), params: { ...query(paging).params, q: search?.trim() || undefined } }),
  sendMessage: (conversationId: string, data: z.input<typeof messageInputSchema>) => request(messageSchema, `${path(conversationId)}/messages`, "POST", messageInputSchema.parse(data)),
  listReactions: (conversationId: string, messageId: number) => request(z.array(messageReactionSchema), `${path(conversationId)}/messages/${messageId}/reactions`),
  addReaction: (conversationId: string, messageId: number, emoji: string) => request(z.array(messageReactionSchema), `${path(conversationId)}/messages/${messageId}/reactions`, "PUT", { emoji }),
  removeReaction: (conversationId: string, messageId: number, emoji: string) => request(z.array(messageReactionSchema), `${path(conversationId)}/messages/${messageId}/reactions`, "DELETE", undefined, { params: { emoji } }),
  async uploadAttachment(conversationId: string, file: File) {
    if (!allowedTypes.has(file.type)) throw new Error("Use uma imagem JPG, PNG ou WebP, ou um arquivo PDF.");
    if (file.size > maxFileSize) throw new Error("Cada anexo pode ter até 10 MB.");
    const ticket = await request(signedUploadSchema, `${path(conversationId)}/attachments/upload-ticket`, "POST", { fileName: file.name, mimeType: file.type, fileSize: file.size });
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Configure as variáveis públicas do Supabase no frontend.");
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error } = await client.storage.from(ticket.bucket).uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type, cacheControl: "3600" });
    if (error) throw new Error(`Falha ao enviar o anexo: ${error.message}`);
    return { fileUrl: ticket.path, fileName: ticket.fileName, mimeType: ticket.mimeType, fileSize: file.size };
  },
};
