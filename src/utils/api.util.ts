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

// funcao para chamada de API
export async function api<T>(
  endpoint: string,
  httpMethod: HttpMethod,
  body?: unknown,
): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: httpMethod,
      data: body,
      withCredentials: true,
    };

    const response = await axiosInstance.request<T>(config);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const serverMessage = axiosError.response?.data?.message;

      throw new Error(serverMessage || "Erro na requisição.", { cause: error });
    }

    throw error;
  }
}

api.get = <T>(endpoint: string) => api<T>(endpoint, "GET");
api.post = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "POST", body);
api.put = <T>(endpoint: string, body: unknown) => api<T>(endpoint, "PUT", body);
api.delete = <T>(endpoint: string) => api<T>(endpoint, "DELETE");