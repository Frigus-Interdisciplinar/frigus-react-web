import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  listConversations,
  listMessages,
  sendMessage,
  type ChatMessage,
} from "@/services/chat.service";
import { useAbortableAsync } from "./useAbortableAsync";

export function useFamilyChat(alias: string | null) {
  const conversationState = useAbortableAsync(listConversations);
  const conversations = conversationState.data ?? [];
  const [selectedChat, setSelectedChat] = useState("");
  const initialConversation =
    alias === "chat-joao"
      ? conversations.find((conversation) =>
          (conversation.name ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes("joao"),
        )
      : alias === "chat-familia"
        ? conversations.find(
            (conversation) => conversation.conversationType === "GROUP",
          )
        : undefined;
  const activeChat =
    selectedChat || initialConversation?.id || conversations[0]?.id || "";
  const loadMessages = useCallback(
    (signal: AbortSignal) =>
      activeChat ? listMessages(activeChat, signal) : Promise.resolve([]),
    [activeChat],
  );
  const messageState = useAbortableAsync(loadMessages);
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const sendController = useRef<AbortController | null>(null);

  useEffect(() => () => sendController.current?.abort(), []);

  const setActiveChat = (id: string) => {
    if (id === activeChat) return;
    sendController.current?.abort();
    sendController.current = null;
    setSending(false);
    setSendError("");
    setInputText("");
    setSelectedChat(id);
  };

  const loadedMessages = messageState.data ?? [];
  const messages = [
    ...loadedMessages,
    ...sentMessages.filter(
      (message) =>
        message.conversationId === activeChat &&
        !loadedMessages.some((loaded) => loaded.id === message.id),
    ),
  ];

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const content = inputText.trim();
    if (
      !content ||
      !activeChat ||
      messageState.loading ||
      sendController.current
    )
      return;
    const controller = new AbortController();
    sendController.current = controller;
    setSending(true);
    setSendError("");
    try {
      const sent = await sendMessage(activeChat, content, controller.signal);
      if (controller.signal.aborted) return;
      setSentMessages((previous) => [...previous, sent]);
      setInputText("");
    } catch (reason) {
      if (!controller.signal.aborted)
        setSendError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível enviar a mensagem.",
        );
    } finally {
      if (sendController.current === controller) {
        sendController.current = null;
        setSending(false);
      }
    }
  };

  const updatedConversations = conversations.map((conversation) => {
    const latestSent = sentMessages.findLast(
      (message) => message.conversationId === conversation.id,
    );
    return latestSent
      ? { ...conversation, latestMessage: latestSent }
      : conversation;
  });

  return {
    conversations: updatedConversations,
    activeChat,
    setActiveChat,
    messages,
    inputText,
    setInputText,
    loading: conversationState.loading,
    messagesLoading: messageState.loading,
    sending,
    error: conversationState.error || messageState.error || sendError,
    handleSendMessage,
  };
}
