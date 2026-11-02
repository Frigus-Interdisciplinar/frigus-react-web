export interface ChatMessage {
  id: number;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageType?: string;
  content: string;
  createdAt?: string;
  attachments?: Array<{
    id: number;
    fileUrl: string;
    fileName?: string;
    mimeType: string;
    fileSize?: number;
  }>;
  relatedShoppingListProductId?: number;
}

export interface Conversation {
  id: string;
  conversationType: string;
  groupId?: string;
  groupName?: string;
  name?: string;
  latestMessage?: ChatMessage;
}
