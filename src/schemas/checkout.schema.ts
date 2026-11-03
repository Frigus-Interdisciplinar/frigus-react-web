import { z } from "zod";
import type { CheckoutInput } from "@/types/transaction.type";
export type { CheckoutInput } from "@/types/transaction.type";

export const checkoutSchema: z.ZodType<CheckoutInput> = z
  .object({
    acceptTerms: z.literal(true, "Aceite os termos para continuar."),
    planCode: z
      .string()
      .min(1, "Este plano ainda não está disponível para compra."),
    paymentMethod: z.enum(["card", "pix", "boleto"]),
    cardNumber: z
      .string()
      .max(32, "O campo não pode exceder 32 caracteres.")
      .optional(),
  })
  .superRefine((value, context) => {
    if (
      value.paymentMethod === "card" &&
      (value.cardNumber ?? "").replace(/\D/g, "").length !== 4
    ) {
      context.addIssue({
        code: "custom",
        path: ["cardNumber"],
        message: "Informe os quatro dígitos de demonstração.",
      });
    }
  });
