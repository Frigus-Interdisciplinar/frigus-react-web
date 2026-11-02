export interface AccountInventoryContext {
  groupId: string;
  stocks: Array<{ id: number; groupId: string; name: string }>;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  storagePlace: string;
  unitPrice: number;
  unitOfMeasure: string;
  ownerGroupId?: string;
  brand?: string;
  imageUrl?: string;
}

export interface StockProduct {
  id: number;
  productId: number;
  stockId: number;
  quantity: number;
  initialQuantity?: number;
  batch?: string;
  minimalQuantity?: number;
  expireDate: string;
  productStatus?: string;
  category: string;
  product?: Product;
}

export interface StockSummary {
  stockCount: number;
  productCount: number;
  itemCount: number;
  pendingShoppingItems: number;
  nearExpiration: StockProduct[];
  itemsByStoragePlace: Record<string, number>;
  consumedThisWeek: Record<string, number>;
}

export interface StockMovement {
  id: number;
  movementType: string;
  quantity: number;
  date?: string;
  userId?: string;
}
