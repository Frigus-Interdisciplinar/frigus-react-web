import type { ErrorResponse } from "../types/error-response.type";
import type { HttpMethod } from "../types/http-methods.type";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// config inicial da instancia do axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://fakestoreapi.com",
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
