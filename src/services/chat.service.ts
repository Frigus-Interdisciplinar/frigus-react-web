import { api } from "@/utils/api.util";

export type Conversation = {
  id: string;
  conversationType: string;
  groupId?: string;
  groupName?: string;
  name?: string;
  latestMessage?: ChatMessage;
};

export type ChatMessage = {
  id: number;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageType?: string;
  content: string;
  createdAt: string;
};

export async function listConversations() {
  return api.get<Conversation[]>("/web/core/chat/conversations");
}

export async function listMessages(conversationId: string) {
  const page = await api.get<{ content?: ChatMessage[] }>(
    `/web/core/chat/conversations/${conversationId}/messages?size=100&sort=createdAt,asc`,
  );
  return page.content ?? [];
}

export async function sendMessage(conversationId: string, content: string) {
  return api.post<ChatMessage>(`/web/core/chat/conversations/${conversationId}/messages`, {
    content,
    messageType: "TEXT",
  });
}
