import type { HttpMethod } from "@/types/http-methods.type";
import axios, { CanceledError, type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  timeoutErrorMessage: "Erro ao conectar com o servidor.",
  headers: {
    "Content-Type": "application/json",
  },
});
let refreshInFlight: Promise<void> | null = null;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | undefined,
    cause: unknown,
  ) {
    super(message, { cause });
    this.name = "ApiError";
  }
}

function requestError(error: unknown): Error {
  if (!axios.isAxiosError<unknown>(error)) {
    if (error instanceof Error) return error;

    const message = (() => {
      if (typeof error === "string") return error;
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        return error.message;
      }
      return "";
    })()
      .split(/[\r\n]/, 1)[0]
      .split("")
      .map((character) => {
        const code = character.charCodeAt(0);
        return code < 0x20 || code === 0x7f ? " " : character;
      })
      .join("")
      .trim()
      .slice(0, 500);

    return new Error(
      message || "Não foi possível concluir a requisição. Tente novamente.",
      { cause: error },
    );
  }

  const data = error.response?.data;
  const message = (() => {
    if (typeof data === "string") return "";
    if (!data || typeof data !== "object") return "";
    if (
      "displayMessage" in data &&
      typeof data.displayMessage === "string" &&
      data.displayMessage.trim()
    ) {
      return data.displayMessage.trim().slice(0, 500);
    }
    return "message" in data && typeof data.message === "string"
      ? data.message.trim().slice(0, 500)
      : "";
  })();
  const status = error.response?.status;
  const fallbackMessage =
    status === 404
      ? "O serviço solicitado não foi encontrado. Tente novamente mais tarde."
      : status !== undefined && status >= 500
        ? "Serviço temporariamente indisponível. Tente novamente."
        : status === 400 || status === 422
          ? "Verifique os dados enviados e tente novamente."
          : status === 401
            ? "Não foi possível autenticar esta solicitação."
            : status === 403
              ? "Você não tem permissão para realizar esta ação."
              : !error.response
                ? error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
                  ? "O servidor demorou para responder. Tente novamente."
                  : "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
                : "Não foi possível concluir a requisição. Tente novamente.";
  return new ApiError(
    message || fallbackMessage,
    status,
    error,
  );
}

function waitForRefresh(
  refresh: Promise<void>,
  signal?: AbortSignal,
): Promise<void> {
  if (!signal) return refresh;
  if (signal.aborted) return Promise.reject(new CanceledError());
  return new Promise((resolve, reject) => {
    const handleAbort = () => reject(new CanceledError());
    signal.addEventListener("abort", handleAbort, { once: true });
    void refresh
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", handleAbort));
  });
}

export async function api<T>(
  endpoint: string,
  httpMethod: HttpMethod,
  body?: unknown,
  options?: { signal?: AbortSignal; timeout?: number },
): Promise<T> {
  const config: AxiosRequestConfig = {
    url: endpoint,
    method: httpMethod,
    data: body,
    withCredentials: true,
    ...options,
  };
  try {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      endpoint.startsWith("/web/auth/")
    ) {
      throw requestError(error);
    }

    try {
      // A renovação é compartilhada; cancelar um consumidor não invalida os demais.
      refreshInFlight ??= axiosInstance
        .post("/web/auth/refresh", {}, { withCredentials: true })
        .then(() => undefined)
        .finally(() => {
          refreshInFlight = null;
        });
      await waitForRefresh(refreshInFlight, options?.signal);
    } catch (refreshError) {
      if (axios.isCancel(refreshError)) throw refreshError;
      if (
        axios.isAxiosError(refreshError) &&
        [401, 403].includes(refreshError.response?.status ?? 0)
      ) {
        window.dispatchEvent(new Event("frigus:session-expired"));
      }
      throw requestError(refreshError);
    }

    try {
      const response = await axiosInstance.request<T>(config);
      return response.data;
    } catch (retryError) {
      if (axios.isCancel(retryError)) throw retryError;
      if (
        axios.isAxiosError(retryError) &&
        retryError.response?.status === 401
      ) {
        window.dispatchEvent(new Event("frigus:session-expired"));
      }
      throw requestError(retryError);
    }
  }
}

api.get = <T>(endpoint: string, options?: { signal?: AbortSignal }) =>
  api<T>(endpoint, "GET", undefined, options);
api.post = <T>(
  endpoint: string,
  body: unknown,
  options?: { signal?: AbortSignal; timeout?: number },
) => api<T>(endpoint, "POST", body, options);
api.put = <T>(
  endpoint: string,
  body: unknown,
  options?: { signal?: AbortSignal },
) => api<T>(endpoint, "PUT", body, options);
api.patch = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, "PATCH", body);
api.delete = <T>(endpoint: string) => api<T>(endpoint, "DELETE");
