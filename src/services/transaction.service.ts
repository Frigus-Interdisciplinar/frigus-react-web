import { api } from "@/utils/api.util";
import { serviceCall } from "@/utils/service.util";
import { transactionInputSchema } from "@/schemas/transaction.schema";
import { validateForm } from "@/utils/validation.util";
import { transactionResponseSchema } from "@/schemas/api-response.schema";

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "BOLETO";

export interface CheckoutTransactionInput {
  planCode: string;
  paymentMethod?: PaymentMethod;
  fakeCardLast4?: string;
  fakePixKey?: string;
}

export interface Transaction {
  id: string;
  status: string;
  amount?: number;
  planCode?: string;
}

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
