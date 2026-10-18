import { api } from "@/utils/api.util";

export type AccountInventoryContext = {
  groupId: string;
  stocks: Array<{ id: number; groupId: string; name: string }>;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  storagePlace: string;
  unitPrice: number;
  unitOfMeasure: string;
  brand?: string;
  imageUrl?: string;
};

export type StockProduct = {
  id: number;
  productId: number;
  stockId: number;
  quantity: number;
  minimalQuantity?: number;
  expireDate: string;
  productStatus?: string;
  category: string;
  product?: Product;
};

export type StockSummary = {
  stockCount: number;
  productCount: number;
  itemCount: number;
  pendingShoppingItems: number;
  nearExpiration: StockProduct[];
  itemsByStoragePlace: Record<string, number>;
  consumedThisWeek: Record<string, number>;
};

export async function getInventoryContext() {
  return api.get<AccountInventoryContext>("/web/core/inventory/active-context");
}

export async function getInventorySummary() {
  return api.get<StockSummary>("/web/core/inventory/summary");
}

export async function listStockProducts(stockId: number) {
  const page = await api.get<{ content: StockProduct[] }>(
    `/web/core/inventory/stocks/${stockId}/products?size=100`,
  );
  return page.content;
}

export async function createProduct(
  groupId: string,
  body: {
    name: string;
    category: string;
    storagePlace: string;
    unitPrice: number;
    unitOfMeasure: string;
  },
) {
  return api.post<Product>(`/web/core/groups/${groupId}/products`, body);
}

export async function createStockProduct(body: {
  productId: number;
  stockId: number;
  quantity: number;
  expireDate: string;
}) {
  return api.post<StockProduct>("/web/core/inventory/stock-products", body);
}

export async function getStockProduct(id: number) {
  return api.get<StockProduct>(`/web/core/inventory/stock-products/${id}`);
}

export async function updateStockProduct(
  id: number,
  body: { minimalQuantity?: number; expireDate: string },
) {
  return api.put<StockProduct>(
    `/web/core/inventory/stock-products/${id}`,
    body,
  );
}

export async function recordMovement(
  id: number,
  movementType: "IN" | "OUT" | "ADJUSTMENT",
  quantity: number,
) {
  return api.post(`/web/core/inventory/stock-products/${id}/movements`, {
    movementType,
    quantity,
  });
}
