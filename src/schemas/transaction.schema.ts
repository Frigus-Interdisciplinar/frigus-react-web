import { z } from "zod";
import { optionalInput } from "./common.schema";

export const transactionInputSchema = z.object({
  planCode: z
    .string()
    .trim()
    .min(1, "Selecione um plano.")
    .max(20, "Plano inválido."),
  paymentMethod: z
    .enum(["CREDIT_CARD", "DEBIT_CARD", "PIX", "BOLETO"])
    .optional(),
  fakeCardLast4: optionalInput(
    z.string().regex(/^\d{4}$/, "Informe os quatro dígitos de demonstração."),
  ),
  fakePixKey: optionalInput(
    z
      .string()
      .min(10, "A chave Pix deve ter ao menos 10 caracteres.")
      .max(150, "Chave Pix de demonstração inválida."),
  ),
});
