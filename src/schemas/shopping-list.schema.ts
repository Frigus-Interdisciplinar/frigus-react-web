import { z } from "zod";

export const createShoppingListSchema = z.object({
  stockId: z.number().int().positive("Selecione um estoque válido."),
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da lista.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  date: z.iso.date().optional(),
});

export const shoppingListItemSchema = z.object({
  productId: z.number().int().positive("Selecione um produto válido."),
  quantity: z
    .number()
    .int("A quantidade deve ser um número inteiro.")
    .finite()
    .positive("A quantidade deve ser maior que zero."),
});

export const shoppingListStatusSchema = z.enum(["PENDING", "PURCHASED"]);

export const shoppingListQuantitySchema = z
  .number()
  .int("A quantidade deve ser um número inteiro.")
  .finite()
  .positive("A quantidade deve ser maior que zero.");
