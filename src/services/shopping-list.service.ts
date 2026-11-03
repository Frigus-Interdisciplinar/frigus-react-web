import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { getInventoryContext } from "@/services/inventory.service";
import type {
  ShoppingList,
  ShoppingListSuggestion,
} from "@/types/shopping-list.type";
import type { Product } from "@/services/inventory.service";
import { validateForm } from "@/utils/validation.util";
import {
  createShoppingListSchema,
  shoppingListItemSchema,
  shoppingListQuantitySchema,
  shoppingListStatusSchema,
} from "@/schemas/shopping-list.schema";
import {
  productResponseSchema,
  shoppingListPageResponseSchema,
  shoppingListResponseSchema,
  shoppingListSuggestionResponseSchema,
} from "@/schemas/api-response.schema";
import { z } from "zod";

const coreShoppingListResponseSchema = z.object({
  id: z.string(),
  stockId: z.number().int(),
  name: z.string(),
  status: z.string(),
  items: z.array(
    z.object({
      id: z.number().int(),
      productId: z.number().int(),
      productName: z.string(),
      productCategory: z.string().nullable().optional(),
      productMeasure: z.string().nullable().optional(),
      quantity: z.number().int(),
      status: z.string(),
    }),
  ),
});

function parseShoppingList(input: unknown) {
  const list = validateForm(coreShoppingListResponseSchema, input);
  return validateForm(shoppingListResponseSchema, {
    id: list.id,
    stockId: list.stockId,
    name: list.name,
    status: list.status,
    items: list.items.map((item) => ({
      id: item.id,
      product: {
        id: item.productId,
        name: item.productName,
        category: item.productCategory ?? "GRAIN",
        unitOfMeasure: item.productMeasure ?? "UNIT",
      },
      quantity: item.quantity,
      status: item.status,
    })),
  });
}

import type { ShoppingListPreviewItem } from "@/types/shopping-list.type";
export type { ShoppingListPreviewItem } from "@/types/shopping-list.type";

export async function getShoppingListPreview(
  signal?: AbortSignal,
): Promise<ShoppingListPreviewItem[]> {
  return serviceCall(async () => {
    const context = await getInventoryContext(signal);
    const stock = context.stocks[0];
    if (!stock) return [];

    const open = await findOpenShoppingList(stock.id, signal);
    if (!open) return [];

    const list = await getShoppingList(open.id, signal);
    return list.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      quantity: item.quantity,
      unit: item.product.unitOfMeasure,
      purchased: item.status === "PURCHASED",
    }));
  });
}

export function getShoppingList(
  id: string,
  signal?: AbortSignal,
): Promise<ShoppingList> {
  return serviceCall(async () =>
    parseShoppingList(
      await api.get<unknown>(
        `/web/core/shopping-lists/${encodeURIComponent(id)}`,
        { signal },
      ),
    ),
  );
}

export async function findOpenShoppingList(
  stockId: number,
  signal?: AbortSignal,
): Promise<{ id: string } | undefined> {
  return serviceCall(async () => {
    const page = await api.get<unknown>(
      `/web/core/shopping-lists?stockId=${stockId}&status=OPEN&page=0&size=20`,
      { signal },
    );
    return validateForm(shoppingListPageResponseSchema, page).content[0];
  });
}

export function createShoppingList(
  stockId: number,
  name: string,
  signal?: AbortSignal,
): Promise<ShoppingList> {
  const body = validateForm(createShoppingListSchema, { stockId, name });
  return serviceCall(async () =>
    parseShoppingList(
      await api.post<unknown>("/web/core/shopping-lists", body, { signal }),
    ),
  );
}

export function listGroupProducts(
  groupId: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  return serviceCall(async () =>
    validateForm(
      z.array(productResponseSchema),
      await api.get<unknown>(
        `/web/core/groups/${encodeURIComponent(groupId)}/products`,
        { signal },
      ),
    ),
  );
}

export function setShoppingListItemStatus(
  listId: string,
  itemId: number,
  status: "PENDING" | "PURCHASED",
): Promise<void> {
  const validatedStatus = validateForm(shoppingListStatusSchema, status);
  return serviceCall(() =>
    api.patch<void>(
      `/web/core/shopping-lists/${encodeURIComponent(listId)}/items/${itemId}`,
      { status: validatedStatus },
    ),
  );
}

export function setShoppingListItemQuantity(
  listId: string,
  itemId: number,
  quantity: number,
): Promise<void> {
  const validatedQuantity = validateForm(shoppingListQuantitySchema, quantity);
  return serviceCall(() =>
    api.patch<void>(
      `/web/core/shopping-lists/${encodeURIComponent(listId)}/items/${itemId}`,
      { quantity: validatedQuantity },
    ),
  );
}

export function addShoppingListItem(
  listId: string,
  productId: number,
  quantity: number,
): Promise<void> {
  const body = validateForm(shoppingListItemSchema, { productId, quantity });
  return serviceCall(() =>
    api.post<void>(
      `/web/core/shopping-lists/${encodeURIComponent(listId)}/items`,
      body,
    ),
  );
}

export function removeShoppingListItem(
  listId: string,
  itemId: number,
): Promise<void> {
  return serviceCall(() =>
    api.delete<void>(`/web/core/shopping-lists/${listId}/items/${itemId}`),
  );
}

export function clearPurchasedShoppingListItems(listId: string): Promise<void> {
  return serviceCall(() =>
    api.delete<void>(`/web/core/shopping-lists/${listId}/purchased-items`),
  );
}

export function completeShoppingList(listId: string): Promise<void> {
  return serviceCall(() =>
    api.post<void>(`/web/core/shopping-lists/${listId}/complete`, {}),
  );
}

export function listShoppingListSuggestions(
  stockId: number,
  signal?: AbortSignal,
): Promise<ShoppingListSuggestion[]> {
  return serviceCall(async () =>
    validateForm(
      z.array(shoppingListSuggestionResponseSchema),
      await api.get<unknown>(
        `/web/core/shopping-lists/suggestions?stockId=${stockId}`,
        { signal },
      ),
    ),
  );
}
