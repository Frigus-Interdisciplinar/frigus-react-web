import { z } from "zod";
import { uuid, checkoutSchema, transactionSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
const path = (transactionId: string) => `/web/transactions/${uuid.parse(transactionId)}`;
export const transactionService = {
  // Reuse the same key when retrying a checkout, to avoid duplicate transactions.
  checkout: (data: z.input<typeof checkoutSchema>, idempotencyKey: string) => request(transactionSchema, "/web/transactions/checkout", "POST", checkoutSchema.parse(data), { headers: { "Idempotency-Key": z.string().min(1).parse(idempotencyKey) } }),
  list: (paging?: Paging) => request(pageSchema(transactionSchema), "/web/transactions", "GET", undefined, query(paging)),
  get: (transactionId: string) => request(transactionSchema, path(transactionId)),
  cancel: (transactionId: string) => request(transactionSchema, `${path(transactionId)}/cancel`, "POST"),
};
