import type { ErrorResponse } from "@/types/error-response.type";
import type { HttpMethod } from "@/types/http-methods.type";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useStore } from "@/store/store";
import { loginResponseSchema } from "@/schemas/api.schema";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string, public fields?: unknown, cause?: unknown) {
    super(message, { cause });
    this.name = "ApiError";
  }
}

// config inicial da instancia do axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  timeoutErrorMessage: "Erro ao conectar com o servidor.",
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest: Promise<void> | undefined;
axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as (AxiosRequestConfig & { sessionRetried?: boolean }) | undefined;
  if (error.response?.status !== 401 || !config || config.sessionRetried || config.url?.startsWith("/web/auth/")) {
    throw error;
  }
  config.sessionRetried = true;
  refreshRequest ??= axiosInstance.post("/web/auth/refresh", {}, { withCredentials: true })
    .then(({ data }) => {
      const session = loginResponseSchema.parse(data);
      useStore.getState().login(session.user, session.accessToken, session.refreshToken);
    }).catch((refreshError: unknown) => {
      useStore.getState().logout();
      throw refreshError;
    }).finally(() => { refreshRequest = undefined; });
  await refreshRequest;
  return axiosInstance.request(config);
});

// funcao para chamada de API
export async function api<T>(
  endpoint: string,
  httpMethod: HttpMethod,
  body?: unknown,
  options: Pick<AxiosRequestConfig, "params" | "headers" | "signal"> = {},
): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: httpMethod,
      data: body,
      withCredentials: true,
      ...options,
    };

    const response = await axiosInstance.request<T>(config);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const data = axiosError.response?.data;
      throw new ApiError(data?.displayMessage || data?.message || "Erro ao conectar com o servidor.", axiosError.response?.status, data?.code, data?.fields, error);
    }

    throw error;
  }
}

api.get = <T>(endpoint: string) => api<T>(endpoint, "GET");
api.post = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "POST", body);
api.put = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "PUT", body);
api.delete = <T>(endpoint: string) => api<T>(endpoint, "DELETE");
api.patch = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "PATCH", body);
