import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import axios, { AxiosError, AxiosHeaders, CanceledError } from "axios";

const http = vi.hoisted(() => ({ request: vi.fn(), post: vi.fn() }));
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, create: () => http } };
});
import { api } from "@/utils/api.util";

function httpError(status: number, data: unknown = {}) {
  return new AxiosError("HTTP error", "ERR_BAD_RESPONSE", undefined, undefined, {
    status, data, statusText: "error", headers: {}, config: { headers: new AxiosHeaders() },
  });
}

describe("renovação de sessão e erros HTTP", () => {
  const dispatchEvent = vi.fn();
  beforeEach(() => {
    http.request.mockReset();
    http.post.mockReset();
    dispatchEvent.mockReset();
    vi.stubGlobal("window", { dispatchEvent });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("compartilha uma renovação entre requisições concorrentes", async () => {
    http.request.mockRejectedValueOnce(httpError(401)).mockRejectedValueOnce(httpError(401))
      .mockResolvedValue({ data: "ok" });
    http.post.mockResolvedValue({});
    expect(await Promise.all([api.get("/web/profile"), api.get("/web/core/groups")])).toEqual(["ok", "ok"]);
    expect(http.post).toHaveBeenCalledTimes(1);
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it("preserva HTTP 500 da repetição sem encerrar a sessão", async () => {
    http.request.mockRejectedValueOnce(httpError(401)).mockRejectedValueOnce(httpError(500, { message: "Indisponível" }));
    http.post.mockResolvedValue({});
    await expect(api.get("/web/profile")).rejects.toMatchObject({ status: 500, message: "Indisponível" });
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it("preserva uma mensagem segura quando uma dependência rejeita com objeto simples", async () => {
    http.request.mockRejectedValue({ message: "Falha ao processar credencial.\n detalhe interno" });
    await expect(api.post("/web/auth/google", {})).rejects.toMatchObject({
      message: "Falha ao processar credencial.",
    });
  });

  it("usa uma mensagem legível quando uma dependência rejeita sem mensagem", async () => {
    http.request.mockRejectedValue(null);
    await expect(api.post("/web/auth/google", {})).rejects.toMatchObject({
      message: "Não foi possível concluir a requisição. Tente novamente.",
    });
  });

  it("não encerra a sessão quando a renovação falha por rede", async () => {
    http.request.mockRejectedValue(httpError(401));
    http.post.mockRejectedValue(new AxiosError("offline", "ERR_NETWORK"));
    await expect(api.get("/web/profile")).rejects.toMatchObject({
      name: "ApiError",
      message: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
    });
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it.each([401, 403])("encerra a sessão se a renovação recebe HTTP %s", async (status) => {
    http.request.mockRejectedValue(httpError(401));
    http.post.mockRejectedValue(httpError(status));
    await expect(api.get("/web/profile")).rejects.toMatchObject({ status });
    expect(dispatchEvent).toHaveBeenCalledWith(expect.objectContaining({ type: "frigus:session-expired" }));
  });

  it("encerra a sessão se a repetição continua não autorizada", async () => {
    http.request.mockRejectedValue(httpError(401));
    http.post.mockResolvedValue({});
    await expect(api.get("/web/profile")).rejects.toMatchObject({ status: 401 });
    expect(http.request).toHaveBeenCalledTimes(2);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
  });

  it("não tenta renovar em endpoints públicos de autenticação", async () => {
    http.request.mockRejectedValue(httpError(401));
    await expect(api.post("/web/auth/forgot-password", {})).rejects.toMatchObject({ status: 401 });
    expect(http.post).not.toHaveBeenCalled();
  });

  it("preserva o cancelamento sem transformá-lo em erro HTTP", async () => {
    http.request.mockRejectedValue(new CanceledError());
    await expect(api.get("/web/profile")).rejects.toSatisfy(axios.isCancel);
    expect(http.post).not.toHaveBeenCalled();
  });

  it("cancela quem aguarda sem cancelar a renovação compartilhada", async () => {
    let finishRefresh!: () => void;
    http.request.mockRejectedValueOnce(httpError(401)).mockRejectedValueOnce(httpError(401)).mockResolvedValue({ data: "ok" });
    http.post.mockReturnValue(new Promise<void>((resolve) => { finishRefresh = resolve; }));
    const controller = new AbortController();
    const canceled = api.get("/web/profile", { signal: controller.signal });
    const other = api.get("/web/core/groups");
    await vi.waitFor(() => expect(http.post).toHaveBeenCalledTimes(1));
    controller.abort();
    await expect(canceled).rejects.toSatisfy(axios.isCancel);
    finishRefresh();
    expect(await other).toBe("ok");
    expect(dispatchEvent).not.toHaveBeenCalled();
  });

  it.each([null, "texto", { message: { secret: "valor" } }, { message: ["erro"] }])("usa uma mensagem segura para payloads sem mensagem validada: %j", async (data) => {
    http.request.mockRejectedValue(httpError(422, data));
    await expect(api.get("/web/profile")).rejects.toMatchObject({ message: "Verifique os dados enviados e tente novamente.", status: 422 });
  });

  it("prefere a mensagem de exibição do servidor", async () => {
    http.request.mockRejectedValue(httpError(503, {
      message: "ServiceUnavailableException",
      displayMessage: "Tente novamente em instantes.",
    }));
    await expect(api.get("/web/profile")).rejects.toMatchObject({
      message: "Tente novamente em instantes.",
      status: 503,
    });
  });

  it("traduz respostas HTTP em texto simples para mensagens compreensíveis", async () => {
    http.request.mockRejectedValue(httpError(404, "404 Not Found"));
    await expect(api.post("/web/auth/google", {})).rejects.toMatchObject({
      message: "O serviço solicitado não foi encontrado. Tente novamente mais tarde.",
      status: 404,
    });
  });
});
