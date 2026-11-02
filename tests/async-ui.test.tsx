// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAbortableAsync } from "@/hooks/useAbortableAsync";
import { useLatestRequest } from "@/hooks/useLatestRequest";
import { useFamilyChat } from "@/hooks/useFamilyChat";
import { listConversations, listMessages, sendMessage, type ChatMessage } from "@/services/chat.service";
import Input from "@/components/Input";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";
import ErrorBoundary from "@/components/ErrorBoundary";

vi.mock("@/services/chat.service", () => ({ listConversations: vi.fn(), listMessages: vi.fn(), sendMessage: vi.fn() }));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("ciclo de vida assíncrono", () => {
  it("aborta a leitura anterior quando uma recarga começa e cancela ao desmontar", () => {
    const { result, unmount } = renderHook(() => useLatestRequest());
    const first = result.current();
    const second = result.current();
    expect(first.aborted).toBe(true);
    expect(second.aborted).toBe(false);
    const reloadAfterUnmount = result.current;
    unmount();
    expect(second.aborted).toBe(true);
    expect(reloadAfterUnmount().aborted).toBe(true);
  });
  it("cancela e ignora uma resposta antiga, mesmo se o transporte ignorar AbortSignal", async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    let firstSignal!: AbortSignal;
    const loadFirst = (signal: AbortSignal) => { firstSignal = signal; return first.promise; };
    const loadSecond = () => second.promise;
    const { result, rerender, unmount } = renderHook(({ load }) => useAbortableAsync(load), { initialProps: { load: loadFirst } });
    await waitFor(() => expect(firstSignal).toBeDefined());
    rerender({ load: loadSecond });
    expect(firstSignal.aborted).toBe(true);
    await act(async () => { second.resolve("atual"); });
    await act(async () => { first.resolve("antiga"); });
    expect(result.current.data).toBe("atual");
    unmount();
  });

  it("trata exceções síncronas no carregador", async () => {
    const load = () => { throw new Error("payload inválido"); };
    const { result } = renderHook(() => useAbortableAsync(load));
    await waitFor(() => expect(result.current.error).toBe("payload inválido"));
    expect(result.current.loading).toBe(false);
  });

  it("esconde os dados anteriores enquanto carrega outra chave", async () => {
    const first = () => Promise.resolve("anterior");
    const next = deferred<string>();
    const { result, rerender } = renderHook(({ load }) => useAbortableAsync(load), { initialProps: { load: first } });
    await waitFor(() => expect(result.current.data).toBe("anterior"));
    rerender({ load: () => next.promise });
    expect(result.current).toEqual({ data: undefined, loading: true, error: "" });
  });

  it("aborta a requisição ao desmontar", async () => {
    let signal!: AbortSignal;
    const load = (current: AbortSignal) => { signal = current; return new Promise<string>(() => undefined); };
    const { unmount } = renderHook(() => useAbortableAsync(load));
    await waitFor(() => expect(signal).toBeDefined());
    unmount();
    expect(signal.aborted).toBe(true);
  });
});

describe("isolamento entre conversas", () => {
  it("não mostra o envio da conversa A na conversa B", async () => {
    vi.mocked(listConversations).mockResolvedValue([{ id: "a", conversationType: "GROUP" }, { id: "b", conversationType: "PRIVATE" }]);
    vi.mocked(listMessages).mockResolvedValue([]);
    const pendingSend = deferred<ChatMessage>();
    vi.mocked(sendMessage).mockReturnValue(pendingSend.promise);
    const { result } = renderHook(() => useFamilyChat(null));
    await waitFor(() => expect(result.current.messagesLoading).toBe(false));
    await waitFor(() => expect(result.current.activeChat).toBe("a"));
    act(() => result.current.setInputText("mensagem privada"));
    let sending!: Promise<void>;
    act(() => { sending = result.current.handleSendMessage({ preventDefault() {} } as React.FormEvent); });
    const signal = vi.mocked(sendMessage).mock.calls.at(-1)?.[2];
    act(() => result.current.setActiveChat("b"));
    expect(signal?.aborted).toBe(true);
    await act(async () => {
      pendingSend.resolve({ id: 1, conversationId: "a", senderId: "u", senderName: "Usuário", content: "mensagem privada" });
      await sending;
    });
    expect(result.current.activeChat).toBe("b");
    expect(result.current.messages).toEqual([]);
    expect(result.current.sending).toBe(false);
  });
});

describe("acessibilidade e recuperação da tela", () => {
  it("associa label, erro e ajuda ao campo mesmo sem id explícito", () => {
    render(<Input label="E-mail" error="E-mail inválido" aria-describedby="instrucoes" />);
    const field = screen.getByLabelText("E-mail");
    const error = screen.getByRole("alert");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(field.getAttribute("aria-describedby")).toBe(`instrucoes ${error.id}`);
  });

  it("mantém o tema utilizável quando localStorage é bloqueado", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("bloqueado"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("bloqueado"); });
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    function Consumer() {
      const { theme, toggleTheme } = useTheme();
      return <button onClick={toggleTheme}>{theme}</button>;
    }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    expect(screen.getByRole("button", { name: "dark" })).toBeDefined();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("exibe recuperação se um componente falha ao renderizar", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    function Broken(): never { throw new Error("falha interna que não deve aparecer na interface"); }
    render(<ErrorBoundary><Broken /></ErrorBoundary>);
    expect(screen.getByRole("button", { name: "Recarregar página" })).toBeDefined();
    expect(screen.queryByText("falha interna que não deve aparecer na interface")).toBeNull();
  });
});
