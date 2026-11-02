import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Send, Users } from "lucide-react";
import { safeHttpUrl } from "@/utils/url.util";
import { useFamilyChat } from "@/hooks/useFamilyChat";
import { useStore } from "@/store/store";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const alias = searchParams.get("alias");
  return <ChatContent key={alias} alias={alias} />;
}

function ChatContent({ alias }: { alias: string | null }) {
  const currentUserId = useStore((state) => state.user?.id);
  const {
    conversations,
    activeChat,
    setActiveChat,
    messages: visibleMessages,
    inputText,
    setInputText,
    loading,
    messagesLoading,
    sending,
    error,
    handleSendMessage,
  } = useFamilyChat(alias);
  const [search, setSearch] = useState("");

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === activeChat,
  );
  const filteredConversations = conversations.filter((conversation) =>
    (conversation.name ?? conversation.groupName ?? "Conversa")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
            Chat da família
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 text-sm mt-0.5 font-sans">
            Compartilhe compras, receitas e avisos com a sua casa
          </p>
        </div>

        <div className="flex-1 bg-white dark:bg-[#1C1E22] rounded-3xl border border-gray-200/80 dark:border-[#343941] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
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
                  aria-label="Buscar conversa"
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
                .filter(
                  (conversation) => conversation.conversationType === "GROUP",
                )
                .map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    aria-pressed={activeChat === chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40"
                        : "hover:bg-gray-100/60 dark:hover:bg-[#252A32]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-frigus-primary text-white">
                        <Users size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy dark:text-white text-xs truncate">
                          {chat.name ?? chat.groupName ?? "Grupo"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-neutral-400 truncate">
                          {chat.latestMessage?.content ||
                            (chat.latestMessage?.attachments?.length
                              ? "Anexo"
                              : "Nenhuma mensagem ainda")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400 dark:text-neutral-400">
                        {chat.latestMessage?.createdAt
                          ? new Date(
                              chat.latestMessage.createdAt,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </button>
                ))}

              <div className="px-3 pt-4 pb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider">
                  Pessoas
                </span>
              </div>
              {filteredConversations
                .filter(
                  (conversation) => conversation.conversationType !== "GROUP",
                )
                .map((chat) => (
                  <button
                    key={chat.id}
                    type="button"
                    aria-pressed={activeChat === chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/40"
                        : "hover:bg-gray-100/60 dark:hover:bg-[#252A32]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-blue-100 text-blue-700">
                        {(chat.name ?? "C").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy dark:text-white text-xs truncate">
                          {chat.name ?? "Conversa privada"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-neutral-400 truncate">
                          {chat.latestMessage?.content ||
                            (chat.latestMessage?.attachments?.length
                              ? "Anexo"
                              : "Nenhuma mensagem ainda")}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 dark:text-neutral-400 shrink-0">
                      {chat.latestMessage?.createdAt
                        ? new Date(
                            chat.latestMessage.createdAt,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col h-full bg-white dark:bg-[#1C1E22]">
            <div className="p-4 px-6 border-b border-gray-100 dark:border-[#343941] flex items-center justify-between bg-white dark:bg-[#1C1E22]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-frigus-primary dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm">
                    {selectedConversation?.name ??
                      selectedConversation?.groupName ??
                      "Selecione uma conversa"}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-neutral-400 font-sans">
                    {selectedConversation?.conversationType === "GROUP"
                      ? "Grupo da família"
                      : "Conversa privada"}
                  </p>
                </div>
              </div>
            </div>

            <div
              role="log"
              aria-label="Mensagens da conversa"
              aria-busy={loading || messagesLoading}
              className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40 dark:bg-[#121418]"
            >
              {loading && <LoadingSpinner label="Carregando conversas…" />}
              {!loading && !error && !conversations.length && (
                <p className="text-center text-sm text-gray-500">
                  Nenhuma conversa disponível.
                </p>
              )}
              {!loading && activeChat && messagesLoading && (
                <LoadingSpinner label="Carregando mensagens…" />
              )}
              {!loading &&
                !messagesLoading &&
                activeChat &&
                !visibleMessages.length &&
                !error && (
                  <p className="text-center text-sm text-gray-500">
                    Esta conversa ainda não tem mensagens.
                  </p>
                )}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-700"
                >
                  {error}
                </p>
              )}
              <div className="text-center my-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-300 uppercase tracking-wider bg-white dark:bg-[#252A32] px-3 py-1 rounded-full border border-gray-100 dark:border-[#343941] shadow-2xs">
                  Até 100 mensagens recentes
                </span>
              </div>

              {visibleMessages.map((msg) => {
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
                      {msg.content && (
                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      )}
                      {msg.attachments?.map((file) => {
                        const url = safeHttpUrl(file.fileUrl);
                        return url ? (
                          <a
                            key={file.id}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block break-words underline underline-offset-4"
                          >
                            {file.fileName ||
                              (file.mimeType.startsWith("image/")
                                ? "Ver imagem"
                                : "Abrir anexo")}
                          </a>
                        ) : (
                          <p key={file.id}>Anexo indisponível</p>
                        );
                      })}
                      <p
                        className={`text-[9px] text-right font-medium ${
                          isMe
                            ? "text-frigus-ice dark:text-blue-200"
                            : "text-gray-400 dark:text-neutral-400"
                        }`}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Horário não informado"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-[#1C1E22] border-t border-gray-100 dark:border-[#343941] flex items-center gap-3"
            >
              <input
                type="text"
                aria-label="Mensagem para a conversa"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!activeChat || messagesLoading || sending}
                placeholder="Digite sua mensagem para a casa..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#343941] text-xs focus:outline-hidden focus:border-frigus-primary dark:focus:border-blue-500 bg-gray-50/50 dark:bg-[#252A32] text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-500"
              />

              <button
                type="submit"
                aria-label={sending ? "Enviando mensagem" : "Enviar mensagem"}
                disabled={
                  !activeChat || messagesLoading || sending || !inputText.trim()
                }
                className="p-2.5 rounded-xl bg-frigus-primary hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all shadow-xs cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
