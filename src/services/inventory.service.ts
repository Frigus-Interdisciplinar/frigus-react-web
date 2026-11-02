import { z } from "zod";
import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { validateForm } from "@/utils/validation.util";
import {
  createProductSchema,
  createStockProductSchema,
  createStockSchema,
  stockMovementSchema,
  updateStockProductSchema,
} from "@/schemas/inventory.schema";
import {
  inventoryContextResponseSchema,
  productResponseSchema,
  stockMovementResponseSchema,
  stockProductResponseSchema,
  stockResponseSchema,
  stockSummaryResponseSchema,
} from "@/schemas/api-response.schema";
import type {
  AccountInventoryContext,
  Product,
  StockMovement,
  StockProduct,
  StockSummary,
} from "@/types/inventory.type";
export type {
  AccountInventoryContext,
  Product,
  StockMovement,
  StockProduct,
  StockSummary,
} from "@/types/inventory.type";

export function getInventoryContext(
  signal?: AbortSignal,
): Promise<AccountInventoryContext> {
  return serviceCall(async () =>
    validateForm(
      inventoryContextResponseSchema,
      await api.get<unknown>("/web/core/inventory/active-context", { signal }),
    ),
  );
}

export function createStock(
  groupId: string,
  name: string,
): Promise<{ id: number; groupId: string; name: string }> {
  const body = validateForm(createStockSchema, { groupId, name });
  return serviceCall(async () =>
    validateForm(
      stockResponseSchema,
      await api.post<unknown>("/web/core/inventory/stocks", body),
    ),
  );
}

export async function listStockProductMovements(
  stockProductId: number,
  signal?: AbortSignal,
): Promise<StockMovement[]> {
  return serviceCall(async () => {
    const page = await api.get<unknown>(
      `/web/core/inventory/stock-products/${stockProductId}/movements?size=100`,
      { signal },
    );
    const content = validateForm(
      z.object({ content: z.array(stockMovementResponseSchema) }),
      page,
    ).content;
    return content;
  });
}

export function getInventorySummary(
  signal?: AbortSignal,
): Promise<StockSummary> {
  return serviceCall(async () =>
    validateForm(
      stockSummaryResponseSchema,
      await api.get<unknown>("/web/core/inventory/summary", { signal }),
    ),
  );
}

export function listStockProducts(
  stockId: number,
  signal?: AbortSignal,
): Promise<StockProduct[]> {
  return serviceCall(async () => {
    const page = await api.get<unknown>(
      `/web/core/inventory/stocks/${stockId}/products?size=100`,
      { signal },
    );
    return validateForm(
      z.object({ content: z.array(stockProductResponseSchema) }),
      page,
    ).content;
  });
}

export function createProduct(
  groupId: string,
  body: {
    name: string;
    category: string;
    storagePlace: string;
    unitPrice: number;
    unitOfMeasure: string;
    brand?: string;
    imageUrl?: string;
  },
): Promise<Product> {
  const validatedBody = validateForm(createProductSchema, body);
  return serviceCall(async () =>
    validateForm(
      productResponseSchema,
      await api.post<unknown>(
        `/web/core/groups/${encodeURIComponent(groupId)}/products`,
        validatedBody,
      ),
    ),
  );
}

export function createStockProduct(body: {
  productId: number;
  stockId: number;
  quantity: number;
  expireDate: string;
  minimalQuantity?: number;
  batch?: string;
}): Promise<StockProduct> {
  const validatedBody = validateForm(createStockProductSchema, body);
  return serviceCall(async () =>
    validateForm(
      stockProductResponseSchema,
      await api.post<unknown>(
        "/web/core/inventory/stock-products",
        validatedBody,
      ),
    ),
  );
}

export function getStockProduct(
  id: number,
  signal?: AbortSignal,
): Promise<StockProduct> {
  return serviceCall(async () =>
    validateForm(
      stockProductResponseSchema,
      await api.get<unknown>(`/web/core/inventory/stock-products/${id}`, {
        signal,
      }),
    ),
  );
}

export function updateStockProduct(
  id: number,
  body: {
    name?: string;
    category?: string;
    storagePlace?: string;
    quantity?: number;
    minimalQuantity?: number;
    initialQuantity?: number;
    expireDate?: string;
    batch?: string;
  },
): Promise<StockProduct> {
  const validatedBody = validateForm(updateStockProductSchema, body);
  return serviceCall(async () =>
    validateForm(
      stockProductResponseSchema,
      await api.put<unknown>(
        `/web/core/inventory/stock-products/${id}`,
        validatedBody,
      ),
    ),
  );
}

export function deleteStockProduct(id: number): Promise<void> {
  return serviceCall(() =>
    api.delete<void>(`/web/core/inventory/stock-products/${id}`),
  );
}

export function recordMovement(
  id: number,
  movementType: "IN" | "OUT" | "ADJUSTMENT",
  quantity: number,
  observation?: string,
): Promise<void> {
  const validatedBody = validateForm(stockMovementSchema, {
    movementType,
    quantity,
    observation,
  });
  return serviceCall(() =>
    api.post<void>(`/web/core/inventory/stock-products/${id}/movements`, {
      ...validatedBody,
    }),
  );
}
