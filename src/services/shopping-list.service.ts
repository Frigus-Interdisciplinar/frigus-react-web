import { api } from "@/utils/api.util";
import { getInventoryContext } from "@/services/inventory.service";

export type ShoppingListPreviewItem = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
};

export async function getShoppingListPreview(): Promise<ShoppingListPreviewItem[]> {
  const context = await getInventoryContext();
  const stock = context.stocks[0];
  if (!stock) return [];

  const page = await api.get<{ content: Array<{ id: string }> }>(
    `/web/core/shopping-lists?stockId=${stock.id}&status=OPEN&page=0&size=20`,
  );
  const listId = page.content[0]?.id;
  if (!listId) return [];

  const list = await api.get<{
    items: Array<{
      id: number;
      product: { name: string; unitOfMeasure: string };
      quantity: number;
      status: string;
    }>;
  }>(`/web/core/shopping-lists/${listId}`);

  return list.items.map((item) => ({
    id: item.id,
    name: item.product.name,
    quantity: item.quantity,
    unit: item.product.unitOfMeasure,
    purchased: item.status === "PURCHASED",
  }));
}
