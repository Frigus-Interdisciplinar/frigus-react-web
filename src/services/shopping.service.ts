import { z } from "zod";
import { id, uuid, pageSchema, shoppingListSchema, shoppingListInputSchema, shoppingItemInputSchema, shoppingItemUpdateSchema, type Paging } from "@/schemas/api.schema";
import { request, query, emptyResponse } from "./request";
const root = "/web/core/shopping-lists";
const listPath = (listId: string) => `${root}/${uuid.parse(listId)}`;
const itemPath = (listId: string, itemId: number) => `${listPath(listId)}/items/${id.parse(itemId)}`;
export const shoppingService = {
  list: (stockId: number, paging?: Paging, status?: "OPEN" | "COMPLETED" | "CANCELED") => request(pageSchema(shoppingListSchema), root, "GET", undefined, { params: { ...query(paging).params, stockId: id.parse(stockId), status } }),
  get: (listId: string) => request(shoppingListSchema, listPath(listId)),
  create: (data: z.input<typeof shoppingListInputSchema>) => request(shoppingListSchema, root, "POST", shoppingListInputSchema.parse(data)),
  suggestions: (stockId: number) => request(z.array(z.record(z.string(), z.unknown())), `${root}/suggestions`, "GET", undefined, { params: { stockId: id.parse(stockId) } }),
  addItem: (listId: string, data: z.input<typeof shoppingItemInputSchema>) => request(z.unknown(), `${listPath(listId)}/items`, "POST", shoppingItemInputSchema.parse(data)),
  updateItem: (listId: string, itemId: number, data: z.input<typeof shoppingItemUpdateSchema>) => request(z.unknown(), itemPath(listId, itemId), "PATCH", shoppingItemUpdateSchema.parse(data)),
  removeItem: (listId: string, itemId: number) => request(emptyResponse, itemPath(listId, itemId), "DELETE"),
  clearPurchased: (listId: string) => request(emptyResponse, `${listPath(listId)}/purchased-items`, "DELETE"),
  complete: (listId: string, supplier?: string) => request(shoppingListSchema, `${listPath(listId)}/complete`, "POST", { supplier }),
  cancel: (listId: string) => request(emptyResponse, listPath(listId), "DELETE"),
};
