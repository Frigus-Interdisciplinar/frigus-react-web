import { useEffect, useMemo, useState } from "react";
import { Search, Send, Paperclip, Smile, MoreVertical, Users } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { listConversations, listMessages, sendMessage, type ChatMessage, type Conversation } from "@/services/chat.service";
import { useStore } from "@/store/store";

export default function ChatPage() {
  const currentUserId = useStore((state) => state.user?.id);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listConversations().then((items) => {
      if (!active) return;
      setConversations(items);
      setActiveChat(items[0]?.id ?? "");
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar as conversas.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!activeChat) { setMessages([]); return; }
    let active = true;
    listMessages(activeChat).then((items) => { if (active) setMessages(items); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Não foi possível carregar as mensagens."); });
    return () => { active = false; };
  }, [activeChat]);

  const selectedConversation = conversations.find((conversation) => conversation.id === activeChat);
  const filteredConversations = useMemo(() => conversations.filter((conversation) =>
    (conversation.name ?? conversation.groupName ?? "Conversa").toLowerCase().includes(search.toLowerCase()),
  ), [conversations, search]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = inputText.trim();
    if (!content || !activeChat || sending) return;
    setSending(true); setError("");
    try {
      const sent = await sendMessage(activeChat, content);
      setMessages((previous) => [...previous, sent]);
      setConversations((previous) => previous.map((conversation) => conversation.id === activeChat ? { ...conversation, latestMessage: sent } : conversation));
      setInputText("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível enviar a mensagem."); }
    finally { setSending(false); }
  };

  return (
    <AppLayout activeSection="chat">
      <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Cabeçalho */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
            Chat da família
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-0.5 font-sans">
            Compartilhe compras, receitas e avisos com a sua casa
          </p>
        </div>

        {/* Split Layout Chat */}
        <div className="flex-1 bg-white dark:bg-[#1C1E22] rounded-3xl border border-gray-200/80 dark:border-[#343941] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Coluna Esquerda: Lista de Conversas (4 colunas) */}
          <div className="md:col-span-4 border-r border-gray-100 dark:border-[#343941] flex flex-col h-full bg-gray-50/30 dark:bg-[#15171B]">
            <div className="p-4 border-b border-gray-100 dark:border-[#343941]">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Buscar conversa"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#252A32] border border-gray-200 dark:border-[#343941] text-xs text-slate-800 dark:text-white focus:outline-hidden focus:border-frigus-primary dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-[#343941] p-2 space-y-1">
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider">
                  Grupos
                </span>
              </div>
              {filteredConversations
                .filter((conversation) => conversation.conversationType === "GROUP")
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40"
                        : "hover:bg-gray-100/60 dark:hover:bg-[#252A32]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-frigus-primary text-white"
                      >
                        <Users size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy dark:text-white text-xs truncate">
                          {chat.name ?? chat.groupName ?? "Grupo"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-neutral-400 truncate">
                          {chat.latestMessage?.content ?? "Nenhuma mensagem ainda"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 dark:text-neutral-400">{chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                    </div>
                  </div>
                ))}

              <div className="px-3 pt-4 pb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider">
                  Pessoas
                </span>
              </div>
              {filteredConversations
                .filter((conversation) => conversation.conversationType !== "GROUP")
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40"
                        : "hover:bg-gray-100/60 dark:hover:bg-[#252A32]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-blue-100 text-blue-700"
                      >
                        {(chat.name ?? "C").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy dark:text-white text-xs truncate">
                          {chat.name ?? "Conversa privada"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-neutral-400 truncate">
                          {chat.latestMessage?.content ?? "Nenhuma mensagem ainda"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 dark:text-neutral-400 shrink-0">
                      {chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Coluna Direita: Conversa Ativa (8 colunas) */}
          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-[#1C1E22]">
            {/* Header da Conversa */}
            <div className="p-4 px-6 border-b border-gray-100 dark:border-[#343941] flex items-center justify-between bg-white dark:bg-[#1C1E22]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-frigus-primary dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm">
                    {selectedConversation?.name ?? selectedConversation?.groupName ?? "Selecione uma conversa"}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400 font-sans">
                    {selectedConversation?.conversationType === "GROUP" ? "Grupo da família" : "Conversa privada"}
                  </p>
                </div>
              </div>

              <button className="p-2 rounded-xl text-gray-400 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-[#252A32] cursor-pointer">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Feed de Mensagens */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40 dark:bg-[#121418]">
              {loading && <p className="text-center text-sm text-gray-500">Carregando conversas…</p>}
              {!loading && !filteredConversations.length && <p className="text-center text-sm text-gray-500">Nenhuma conversa disponível.</p>}
              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}
              <div className="text-center my-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-300 uppercase tracking-wider bg-white dark:bg-[#252A32] px-3 py-1 rounded-full border border-gray-100 dark:border-[#343941] shadow-2xs">
                  Hoje
                </span>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {msg.senderName?.[0] ?? "?"}
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? "bg-frigus-primary dark:bg-blue-600 text-white rounded-br-xs shadow-xs"
                        : "bg-white dark:bg-[#252A32] text-frigus-navy dark:text-white border border-gray-200/80 dark:border-[#343941] rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {!isMe && (
                      <p className="font-bold text-[10px] text-gray-400 dark:text-neutral-400">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                    <p
                      className={`text-[9px] text-right font-medium ${
                        isMe ? "text-frigus-ice dark:text-blue-200" : "text-gray-400 dark:text-neutral-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ); })}
            </div>

            {/* Input de Mensagem */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-[#1C1E22] border-t border-gray-100 dark:border-[#343941] flex items-center gap-3"
            >
              <button
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-frigus-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors cursor-pointer"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!activeChat || sending}
                placeholder="Digite sua mensagem para a casa..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#343941] text-xs focus:outline-hidden focus:border-frigus-primary dark:focus:border-blue-500 bg-gray-50/50 dark:bg-[#252A32] text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              />

              <button
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-frigus-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252A32] transition-colors hidden sm:block cursor-pointer"
              >
                <Smile size={18} />
              </button>

              <button
                type="submit"
                disabled={!activeChat || sending || !inputText.trim()}
                className="p-2.5 rounded-xl bg-frigus-primary hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
