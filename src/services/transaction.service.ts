import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { transactionInputSchema } from "@/schemas/transaction.schema";
import { validateForm } from "@/utils/validation.util";
import { transactionResponseSchema } from "@/schemas/api-response.schema";
import type {
  CheckoutTransactionInput,
  Transaction,
} from "@/types/transaction.type";
export type {
  CheckoutTransactionInput,
  PaymentMethod,
  Transaction,
} from "@/types/transaction.type";

export function createCheckoutTransaction(
  input: CheckoutTransactionInput,
  signal?: AbortSignal,
): Promise<Transaction> {
  const validatedInput = validateForm(transactionInputSchema, input);
  return serviceCall(async () =>
    validateForm(
      transactionResponseSchema,
      await api.post<unknown>(
        "/web/core/transactions/checkout",
        validatedInput,
        { signal },
      ),
    ),
  );
}

export function getTransaction(
  id: string,
  signal?: AbortSignal,
): Promise<Transaction> {
  return serviceCall(async () =>
    validateForm(
      transactionResponseSchema,
      await api.get<unknown>(
        `/web/core/transactions/${encodeURIComponent(id)}`,
        {
          signal,
        },
      ),
    ),
  );
}
