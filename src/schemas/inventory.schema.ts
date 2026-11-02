import { z } from "zod";
import {
  categorySchema,
  money,
  nonNegativeInteger,
  optionalText,
  positiveId,
  requiredText,
  storagePlaceSchema,
  unitOfMeasureSchema,
} from "./common.schema";

export const createStockSchema = z.object({
  groupId: z.uuid(),
  name: requiredText("Nome", 2000),
});
export const createProductSchema = z.object({
  name: requiredText("Nome", 255),
  category: categorySchema,
  storagePlace: storagePlaceSchema,
  unitPrice: money(99999999.99, false),
  unitOfMeasure: unitOfMeasureSchema,
  brand: optionalText(120),
  imageUrl: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z
      .url()
      .max(2048)
      .refine(
        (v) => ["http:", "https:"].includes(new URL(v).protocol),
        "Use uma URL HTTP ou HTTPS.",
      )
      .optional(),
  ),
});
export const createStockProductSchema = z.object({
  productId: positiveId,
  stockId: positiveId,
  quantity: nonNegativeInteger,
  minimalQuantity: nonNegativeInteger.optional(),
  expireDate: z.iso.date("Informe uma validade válida."),
  batch: optionalText(120),
});
export const updateStockProductSchema = z
  .object({
    name: requiredText("Nome", 255).optional(),
    category: categorySchema.optional(),
    storagePlace: storagePlaceSchema.optional(),
    quantity: nonNegativeInteger.optional(),
    minimalQuantity: nonNegativeInteger.optional(),
    initialQuantity: nonNegativeInteger.optional(),
    expireDate: z.iso.date("Informe uma validade válida.").optional(),
    batch: z.string().max(120).optional(),
  })
  .refine(
    (value) => Object.values(value).some((v) => v !== undefined),
    "Informe ao menos um campo para atualizar.",
  );
export const stockMovementSchema = z
  .object({
    movementType: z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: nonNegativeInteger,
    observation: optionalText(2000),
  })
  .refine((v) => v.movementType === "ADJUSTMENT" || v.quantity > 0, {
    path: ["quantity"],
    message: "Entradas e saídas devem ser maiores que zero.",
  });
