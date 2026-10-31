import { z } from "zod";

export const nullableOptional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) => (value === null ? undefined : value),
    schema.optional(),
  );
export const optionalInput = <T extends z.ZodType>(schema: T) =>
  z.preprocess(
    (value) =>
      value === null || (typeof value === "string" && !value.trim())
        ? undefined
        : value,
    schema.optional(),
  );
export const optionalText = (max: number) =>
  optionalInput(z.string().trim().max(max));
export const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} é obrigatório.`)
    .max(max, `Use no máximo ${max} caracteres.`);
export const positiveId = z.number().int().positive().max(2147483647);
export const nonNegativeInteger = z.number().int().min(0).max(2147483647);
export const money = (max: number, allowZero = true) =>
  z
    .number()
    .finite()
    .min(allowZero ? 0 : 0.01)
    .max(max)
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.00001,
      "Use no máximo duas casas decimais.",
    );
export const categorySchema = z.enum([
  "FRUIT",
  "VEGETABLE",
  "DAIRY",
  "GRAIN",
  "MEAT",
  "BEVERAGE",
  "CLEANING",
  "PERSONAL_HYGIENE",
  "FISH",
  "FROZEN",
  "SWEETS",
  "CANNED",
  "SEASONING",
]);
export const storagePlaceSchema = z.enum([
  "FRIDGE",
  "FREEZER",
  "PANTRY",
  "CABINET",
  "SHELF",
]);
export const unitOfMeasureSchema = z.enum([
  "KILOGRAM",
  "GRAM",
  "LITER",
  "MILLILITER",
  "UNIT",
  "DOZEN",
  "PACKAGE",
]);
