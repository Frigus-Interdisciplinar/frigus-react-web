import { z } from "zod";
import { id, recipeSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query, emptyResponse } from "./request";
const root = "/web/core/recipes";
export const recipeService = {
  list: (paging?: Paging, name?: string) => request(pageSchema(recipeSchema), root, "GET", undefined, { params: { ...query(paging).params, name } }),
  favorites: (paging?: Paging) => request(pageSchema(recipeSchema), `${root}/favorites`, "GET", undefined, query(paging)),
  suggestions: (stockId?: number, limit?: number) => request(z.array(recipeSchema), `${root}/suggestions`, "GET", undefined, { params: { stockId, limit } }),
  get: (recipeId: number) => request(recipeSchema, `${root}/${id.parse(recipeId)}`),
  favorite: (recipeId: number) => request(emptyResponse, `${root}/${id.parse(recipeId)}/favorite`, "PUT"),
  unfavorite: (recipeId: number) => request(emptyResponse, `${root}/${id.parse(recipeId)}/favorite`, "DELETE"),
};
