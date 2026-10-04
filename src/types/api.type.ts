import type { z } from "zod";
import type * as schemas from "@/schemas/api.schema";
export type User = z.output<typeof schemas.userSchema>;
export type Group = z.output<typeof schemas.groupSchema>;
export type Stock = z.output<typeof schemas.stockSchema>;
export type StockProduct = z.output<typeof schemas.stockProductSchema>;
export type Product = z.output<typeof schemas.productSchema>;
export type StockMovement = z.output<typeof schemas.movementSchema>;
export type Discard = z.output<typeof schemas.discardSchema>;
export type Conversation = z.output<typeof schemas.conversationSchema>;
export type Message = z.output<typeof schemas.messageSchema>;
export type Plan = z.output<typeof schemas.planSchema>;
export type Subscription = z.output<typeof schemas.subscriptionSchema>;
export type Transaction = z.output<typeof schemas.transactionSchema>;
export type { Paging } from "@/schemas/api.schema";
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
