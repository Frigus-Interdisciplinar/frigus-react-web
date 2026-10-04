import { z } from "zod";
import { api, ApiError } from "@/utils/api.util";
import type { HttpMethod } from "@/types/http-methods.type";
import { pagingSchema, type Paging } from "@/schemas/api.schema";

export async function request<S extends z.ZodType>(schema: S, path: string, method: HttpMethod = "GET", body?: unknown, options?: Parameters<typeof api>[3]): Promise<z.output<S>> {
  const data = await api<unknown>(path, method, body, options);
  const result = schema.safeParse(data);
  if (!result.success) throw new ApiError("O servidor retornou dados incompatíveis com o contrato.", undefined, "INVALID_RESPONSE", result.error.issues);
  return result.data;
}
export const query = (paging: Paging = {}) => ({ params: pagingSchema.parse(paging) });
export const emptyResponse = z.union([z.undefined(), z.literal(""), z.null()]).transform(() => undefined);
