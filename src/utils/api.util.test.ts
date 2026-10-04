import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, expect, it, vi } from "vitest";
import { api, ApiError } from "./api.util";
import { useStore } from "@/store/store";

const { adapter } = vi.hoisted(() => ({ adapter: vi.fn() }));
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, create: (config: object) => actual.default.create({ ...config, adapter }) } };
});
const user = { id: "00000000-0000-4000-8000-000000000001", name: "Teste", email: "teste@example.com", birthDate: "01/01/2000", accountType: "DOMESTIC" as const };
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({ config, data, status, statusText: "", headers: {} });
const failure = (config: InternalAxiosRequestConfig, status: number, data: unknown = {}) => new AxiosError("Request failed", undefined, config, undefined, response(config, data, status));
beforeEach(() => { adapter.mockReset(); useStore.getState().logout(); });

it("envia cookies e preserva status, código e erros dos campos", async () => {
  const fields = [{ fieldName: "name", errorMessage: "Obrigatório" }];
  adapter.mockImplementation((config) => Promise.reject(failure(config, 400, { message: "Falhou", displayMessage: "Confira os dados", code: "BAD_REQUEST", fields })));
  await expect(api.get("/web/profile")).rejects.toMatchObject({ message: "Confira os dados", status: 400, code: "BAD_REQUEST", fields });
  expect(adapter.mock.calls[0][0].withCredentials).toBe(true);
});

it("compartilha o refresh entre duas requisições e tenta novamente uma vez", async () => {
  let finishRefresh: (value: unknown) => void;
  const pending = new Promise((resolve) => { finishRefresh = resolve; });
  adapter.mockImplementation(async (config: InternalAxiosRequestConfig & { sessionRetried?: boolean }) => {
    if (config.url === "/web/auth/refresh") { await pending; return response(config, { user, accessToken: "novo", refreshToken: "refresh" }); }
    if (!config.sessionRetried) throw failure(config, 401);
    return response(config, { ok: true });
  });
  const calls = [api.get("/web/profile"), api.get("/web/core/groups")];
  await vi.waitFor(() => expect(adapter.mock.calls.filter(([config]) => config.url === "/web/auth/refresh")).toHaveLength(1));
  finishRefresh!(undefined);
  expect(await Promise.all(calls)).toEqual([{ ok: true }, { ok: true }]);
  expect(useStore.getState().accessToken).toBe("novo");
  expect(adapter).toHaveBeenCalledTimes(5);
});

it("não renova login com credenciais inválidas", async () => {
  adapter.mockImplementation((config) => Promise.reject(failure(config, 401)));
  await expect(api.post("/web/auth/login", {})).rejects.toBeInstanceOf(ApiError);
  expect(adapter).toHaveBeenCalledTimes(1);
});

it("limpa a sessão quando o refresh expirou sem entrar em loop", async () => {
  useStore.getState().login(user, "antigo", "antigo");
  adapter.mockImplementation((config) => Promise.reject(failure(config, 401)));
  await expect(api.get("/web/profile")).rejects.toMatchObject({ status: 401 });
  expect(useStore.getState().user).toBeNull();
  expect(adapter).toHaveBeenCalledTimes(2);
});

it("não repete 403 nem falhas de rede", async () => {
  adapter.mockImplementationOnce((config) => Promise.reject(failure(config, 403))).mockRejectedValueOnce(new AxiosError("Network error"));
  await expect(api.get("/web/user")).rejects.toMatchObject({ status: 403 });
  await expect(api.get("/web/profile")).rejects.toBeInstanceOf(ApiError);
  expect(adapter).toHaveBeenCalledTimes(2);
  expect(axios.isAxiosError(new AxiosError())).toBe(true);
});
