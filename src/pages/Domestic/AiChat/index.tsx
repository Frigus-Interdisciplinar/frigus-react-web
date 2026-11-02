import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import { getInventoryContext } from "@/services/inventory.service";
import { sendAiChatMessage } from "@/services/ai-chat.service";
import type { AiChatResponse } from "@/schemas/ai-chat.schema";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  recipe?: AiChatResponse;
};

const prompts = [
  "O que posso cozinhar com o que tenho em casa?",
  "Me sugira uma receita para aproveitar alimentos perto do vencimento.",
  "Sugira uma receita simples para hoje.",
];

function renderAssistantMessage(content: string) {
  return content.split(/(\*\*.+?\*\*)/gs).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>
      : part,
  );
}

export default function AiChatPage() {
  const [stockId, setStockId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const nextId = useRef(0);
  const sendController = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    getInventoryContext(controller.signal)
      .then((context) => {
        if (controller.signal.aborted) return;
        const stock = context.stocks[0];
        if (stock) setStockId(stock.id);
        else
          setError(
            "Não encontramos um estoque para usar no chat. Crie um estoque e tente novamente.",
          );
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : "Não foi possível carregar seu estoque.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      sendController.current?.abort();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "end",
    });
  }, [messages, sending]);

  const send = async (rawContent: string) => {
    const content = rawContent.trim();
    if (!content || !stockId || sendController.current) return;
    const controller = new AbortController();
    sendController.current = controller;
    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      content,
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setSending(true);
    setError("");
    try {
      const response = await sendAiChatMessage(
        { message: content, stockId, sessionId },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      if (response.sessionId) setSessionId(response.sessionId);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content:
            response.chatMessage?.trim() ||
            "Não consegui gerar uma resposta agora. Tente reformular sua pergunta.",
          recipe: response.recipeName ? response : undefined,
        },
      ]);
    } catch (reason) {
      if (!controller.signal.aborted)
        setError(
          reason instanceof Error
            ? reason.message
            : "Não foi possível enviar a mensagem.",
        );
    } finally {
      if (!controller.signal.aborted) setSending(false);
      if (sendController.current === controller) sendController.current = null;
    }
  };

  return (
    <>
      <section
        className="mx-auto flex h-[calc(100vh-190px)] min-h-[440px] max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#D5E1F2] bg-white shadow-xs dark:border-[#34383E] dark:bg-[#1B1D20]"
        aria-label="Chat com inteligência artificial"
      >
        <header className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-[#34383E]">
          <div className="grid size-11 place-items-center rounded-2xl bg-[#EAF3FF] text-[#2552C8] dark:bg-[#202B43] dark:text-blue-300">
            <Bot size={23} />
          </div>
          <div>
            <h1 className="font-montserrat text-base font-bold text-frigus-navy dark:text-white">
              Assistente Frigus
            </h1>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Receitas com os ingredientes do seu estoque
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#F5F8FC] px-2.5 py-1 text-[10px] font-semibold text-[#596B85] dark:bg-[#252A32] dark:text-neutral-300">
            <Sparkles size={12} /> Chat IA
          </span>
        </header>

        <div
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {messages.length === 0 && (
            <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-[#EAF3FF] text-[#2552C8] dark:bg-[#202B43] dark:text-blue-300">
                <Sparkles size={26} />
              </div>
              <h2 className="mt-5 font-montserrat text-2xl font-bold text-frigus-navy dark:text-white">
                Oi! Como posso ajudar?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-neutral-400">
                Peça sugestões de receitas usando os ingredientes disponíveis no
                seu estoque.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={loading || !stockId || sending}
                    onClick={() => void send(prompt)}
                    className="rounded-2xl border border-[#D5E1F2] bg-[#F7FAFF] px-3.5 py-2.5 text-left text-xs font-medium text-frigus-navy transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 dark:border-[#34383E] dark:bg-[#202329] dark:text-neutral-200 dark:hover:bg-[#252A32]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[#2552C8] dark:bg-[#202B43] dark:text-blue-300">
                  <Bot size={17} />
                </div>
              )}
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-[#2552C8] text-white" : "rounded-bl-md bg-[#F5F8FC] text-slate-700 dark:bg-[#252A32] dark:text-neutral-200"}`}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.role === "assistant"
                    ? renderAssistantMessage(message.content)
                    : message.content}
                </p>
                {message.recipe && (
                  <div className="mt-3 border-t border-slate-200 pt-3 dark:border-[#41464E]">
                    <p className="font-semibold">{message.recipe.recipeName}</p>
                    {message.recipe.recipeDescription && (
                      <p className="mt-1 text-xs opacity-80">
                        {message.recipe.recipeDescription}
                      </p>
                    )}
                    {message.recipe.matchedIngredients != null && (
                      <p className="mt-2 text-xs opacity-75">
                        {message.recipe.matchedIngredients} ingrediente(s)
                        disponível(is)
                        {message.recipe.missingIngredients
                          ? ` · ${message.recipe.missingIngredients} faltando`
                          : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#2552C8] text-white">
                  <UserRound size={16} />
                </div>
              )}
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-neutral-400">
              <div className="grid size-8 place-items-center rounded-xl bg-[#EAF3FF] text-[#2552C8] dark:bg-[#202B43] dark:text-blue-300">
                <Bot size={17} />
              </div>
              <span role="status">Pensando…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p
            role="alert"
            className="mx-4 mb-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </p>
        )}
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            void send(draft);
          }}
          className="flex items-end gap-3 border-t border-gray-100 p-4 dark:border-[#34383E] sm:p-5"
        >
          <label htmlFor="ai-chat-input" className="sr-only">
            Escreva sua mensagem para o Chat IA
          </label>
          <textarea
            id="ai-chat-input"
            rows={1}
            maxLength={4000}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void send(draft);
              }
            }}
            placeholder={
              loading
                ? "Carregando seu estoque…"
                : "Pergunte sobre receitas, estoque ou compras…"
            }
            disabled={loading || !stockId || sending}
            className="max-h-32 min-h-12 flex-1 resize-y rounded-2xl border border-gray-200 bg-[#F7FAFF] px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#2552C8] disabled:opacity-60 dark:border-[#34383E] dark:bg-[#202329] dark:text-white"
          />
          <button
            type="submit"
            disabled={!draft.trim() || loading || !stockId || sending}
            aria-label="Enviar mensagem"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#2552C8] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </section>
    </>
  );
}
