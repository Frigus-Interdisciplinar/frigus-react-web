import type { ErrorResponse } from "@/types/error-response.type";
import type { HttpMethod } from "@/types/http-methods.type";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// config inicial da instancia do axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  timeoutErrorMessage: "Erro ao conectar com o servidor.",
  headers: {
    "Content-Type": "application/json",
  },
});
let refreshInFlight: Promise<void> | null = null;

// funcao para chamada de API
export async function api<T>(
  endpoint: string,
  httpMethod: HttpMethod,
  body?: unknown,
  options?: Pick<AxiosRequestConfig, "signal">,
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

      if (
        axiosError.response?.status === 401 &&
        endpoint !== "/web/auth/login" &&
        endpoint !== "/web/auth/refresh" &&
        endpoint !== "/web/auth/logout"
      ) {
        try {
          refreshInFlight ??= axiosInstance
            .post("/web/auth/refresh", {}, { withCredentials: true })
            .then(() => undefined)
            .finally(() => { refreshInFlight = null; });
          await refreshInFlight;
          const retry = await axiosInstance.request<T>({
            url: endpoint,
            method: httpMethod,
            data: body,
            withCredentials: true,
            ...options,
          });
          return retry.data;
        } catch {
          window.dispatchEvent(new Event("frigus:session-expired"));
          // Use the original authorization error if the refresh cookie is missing or expired.
        }
      }

      const serverMessage = axiosError.response?.data?.message;

      throw new Error(serverMessage || "Erro na requisição.", { cause: error });
    }

    throw error;
  }
}

api.get = <T>(endpoint: string, options?: Pick<AxiosRequestConfig, "signal">) => api<T>(endpoint, "GET", undefined, options);
api.post = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "POST", body);
api.put = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "PUT", body);
api.patch = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "PATCH", body);
api.delete = <T>(endpoint: string) => api<T>(endpoint, "DELETE");
