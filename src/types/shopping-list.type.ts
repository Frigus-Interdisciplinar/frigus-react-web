export interface ShoppingListProduct {
  id: number;
  name: string;
  category: string;
  unitOfMeasure: string;
}

export interface ShoppingListItem {
  id: number;
  product: ShoppingListProduct;
  quantity: number;
  status: "PENDING" | "PURCHASED" | string;
}

export interface ShoppingList {
  id: string;
  stockId: number;
  name: string;
  status: string;
  items: ShoppingListItem[];
}

export interface ShoppingListPage {
  content: Array<{ id: string; status: string }>;
}

export interface ShoppingListSuggestion {
  product: ShoppingListProduct;
  currentQuantity: number;
  suggestedQuantity: number;
  reason: string;
}

export type ShoppingListPreviewItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
};
