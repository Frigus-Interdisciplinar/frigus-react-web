import { z } from "zod";
import { id, uuid, stockSchema, stockInputSchema, stockProductSchema, stockProductCreateSchema, stockProductUpdateSchema, movementSchema, movementInputSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
const root = "/web/core/inventory";
const productPath = (productId: number) => `${root}/stock-products/${id.parse(productId)}`;
export const inventoryService = {
  listStocks: (groupId: string, paging?: Paging) => request(pageSchema(stockSchema), `${root}/groups/${uuid.parse(groupId)}/stocks`, "GET", undefined, query(paging)),
  createStock: (data: z.input<typeof stockInputSchema>) => request(stockSchema, `${root}/stocks`, "POST", stockInputSchema.parse(data)),
  updateStock: (stockId: number, data: z.input<typeof stockInputSchema>) => request(stockSchema, `${root}/stocks/${id.parse(stockId)}`, "PUT", stockInputSchema.parse(data)),
  listProducts: (stockId: number, paging?: Paging) => request(pageSchema(stockProductSchema), `${root}/stocks/${id.parse(stockId)}/products`, "GET", undefined, query(paging)),
  getProduct: (productId: number) => request(stockProductSchema, productPath(productId)),
  createProduct: (data: z.input<typeof stockProductCreateSchema>) => request(stockProductSchema, `${root}/stock-products`, "POST", stockProductCreateSchema.parse(data)),
  updateProduct: (productId: number, data: z.input<typeof stockProductUpdateSchema>) => request(stockProductSchema, productPath(productId), "PUT", stockProductUpdateSchema.parse(data)),
  listMovements: (productId: number, paging?: Paging) => request(pageSchema(movementSchema), `${productPath(productId)}/movements`, "GET", undefined, query(paging)),
  createMovement: (productId: number, data: z.input<typeof movementInputSchema>) => request(movementSchema, `${productPath(productId)}/movements`, "POST", movementInputSchema.parse(data)),
};
