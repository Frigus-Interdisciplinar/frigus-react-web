import { useState } from "react";
import { Search, Send, Paperclip, Smile, MoreVertical, Users } from "lucide-react";
import AppLayout from "@/components/Layout/AppLayout";

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isGroup?: boolean;
  avatarLetter: string;
  avatarBg: string;
};

const chats: ChatItem[] = [
  {
    id: "group-1",
    name: "Casa Henrique",
    lastMessage: "Olha o que encontrei para os tomates.",
    time: "09:43",
    unreadCount: 2,
    isGroup: true,
    avatarLetter: "F",
    avatarBg: "bg-frigus-primary text-white",
  },
  {
    id: "user-1",
    name: "Marina Souza",
    lastMessage: "Tudo certo com a compra.",
    time: "Ontem",
    avatarLetter: "M",
    avatarBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "user-2",
    name: "Lucas Paulo",
    lastMessage: "Vou passar no mercado.",
    time: "Ontem",
    avatarLetter: "L",
    avatarBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "user-3",
    name: "Ana Carvalho",
    lastMessage: "Obrigada pelo convite.",
    time: "Seg",
    avatarLetter: "A",
    avatarBg: "bg-purple-100 text-purple-700",
  },
];

type Message = {
  id: string;
  sender: string;
  isMe: boolean;
  text: string;
  time: string;
  avatarLetter?: string;
};

const initialMessages: Message[] = [
  {
    id: "m1",
    sender: "Marina",
    isMe: false,
    text: "Gente, os tomates estão perto da validade. Alguém tem ideia do que fazer?",
    time: "09:38",
    avatarLetter: "M",
  },
  {
    id: "m2",
    sender: "Marina",
    isMe: false,
    text: "Olha o que encontrei para os tomates: tem receita de omelete sugerida no app!",
    time: "09:40",
    avatarLetter: "M",
  },
  {
    id: "m3",
    sender: "Você",
    isMe: true,
    text: "Boa! Vou preparar hoje à noite no jantar.",
    time: "09:43",
  },
  {
    id: "m4",
    sender: "Lucas",
    isMe: false,
    text: "Show! Vou passar no mercado mais tarde, falta salsinha na lista de compras.",
    time: "09:50",
    avatarLetter: "L",
  },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string>("group-1");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: "Você",
        isMe: true,
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputText("");
  };

  return (
    <AppLayout activeSection="chat">
      <div className="space-y-4 h-[calc(100vh-140px)] flex flex-col">
        {/* Cabeçalho */}
        <div>
          <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy">
            Chat da família
          </h1>
          <p className="text-gray-500 text-sm mt-0.5 font-sans">
            Compartilhe compras, receitas e avisos com a sua casa
          </p>
        </div>

        {/* Split Layout Chat */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Coluna Esquerda: Lista de Conversas (4 colunas) */}
          <div className="md:col-span-4 border-r border-gray-100 flex flex-col h-full bg-gray-50/30">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar conversa"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs focus:outline-hidden focus:border-frigus-primary"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-2 space-y-1">
              <div className="px-3 pt-2 pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Grupos
                </span>
              </div>
              {chats
                .filter((c) => c.isGroup)
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 border border-blue-100"
                        : "hover:bg-gray-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${chat.avatarBg}`}
                      >
                        <Users size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy text-xs truncate">
                          {chat.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] text-gray-400">{chat.time}</span>
                      {chat.unreadCount && (
                        <span className="w-4 h-4 rounded-full bg-frigus-primary text-white text-[9px] font-bold flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

              <div className="px-3 pt-4 pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Pessoas
                </span>
              </div>
              {chats
                .filter((c) => !c.isGroup)
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      activeChat === chat.id
                        ? "bg-blue-50/80 border border-blue-100"
                        : "hover:bg-gray-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${chat.avatarBg}`}
                      >
                        {chat.avatarLetter}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-frigus-navy text-xs truncate">
                          {chat.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-400 shrink-0">
                      {chat.time}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Coluna Direita: Conversa Ativa (8 colunas) */}
          <div className="md:col-span-8 flex flex-col h-full">
            {/* Header da Conversa */}
            <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-frigus-primary text-white flex items-center justify-center font-bold text-xs">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-frigus-navy text-sm">
                    Casa Henrique
                  </h3>
                  <p className="text-[11px] text-gray-400 font-sans">
                    4 membros • grupo da família
                  </p>
                </div>
              </div>

              <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Feed de Mensagens */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40">
              <div className="text-center my-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-gray-100 shadow-2xs">
                  Hoje
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${
                    msg.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {!msg.isMe && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {msg.avatarLetter || msg.sender[0]}
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      msg.isMe
                        ? "bg-frigus-primary text-white rounded-br-xs shadow-xs"
                        : "bg-white text-frigus-navy border border-gray-200/80 rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    {!msg.isMe && (
                      <p className="font-bold text-[10px] text-gray-400">
                        {msg.sender}
                      </p>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[9px] text-right font-medium ${
                        msg.isMe ? "text-frigus-ice" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Mensagem */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-gray-100 flex items-center gap-3"
            >
              <button
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-frigus-navy hover:bg-gray-100 transition-colors"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua mensagem para a casa..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-frigus-primary bg-gray-50/50"
              />

              <button
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-frigus-navy hover:bg-gray-100 transition-colors hidden sm:block"
              >
                <Smile size={18} />
              </button>

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-frigus-primary hover:bg-blue-700 text-white transition-all shadow-xs"
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
