import { z } from "zod";
import type { Plan, PlanSubscription } from "@/types/plan.type";
export type { Plan, PlanSubscription } from "@/types/plan.type";

export const planResponseSchema: z.ZodType<Plan> = z.object({
  id: z.number().int().positive(),
  planCode: z.string().min(1).max(20),
  name: z.string().min(1),
  description: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  price: z.number().finite().nonnegative(),
  billingInterval: z
    .enum(["MONTHLY", "YEARLY"])
    .nullish()
    .transform((value) => value ?? null),
  active: z.boolean(),
  benefits: z
    .array(
      z.object({
        code: z.string(),
        label: z.string(),
        enabled: z.boolean(),
        limit: z.number().int().nullish(),
      }),
    )
    .nullish()
    .transform((value) => value ?? []),
});

export const planCatalogSchema = z.array(planResponseSchema);
export const planSubscriptionSchema: z.ZodType<PlanSubscription> = z.object({
  status: z.enum(["TRIAL", "ACTIVE", "CANCELED", "EXPIRED", "DELINQUENT"]),
  plan: z.object({
    planCode: z.string().min(1).max(20),
    name: z.string().min(1),
    description: z.string().nullish().transform((value) => value ?? ""),
    price: z.number().finite().nonnegative(),
    billingInterval: z
      .enum(["MONTHLY", "YEARLY"])
      .nullish()
      .transform((value) => value ?? null),
    limits: z
      .object({
        maxProductsPerStock: z.number().int().nonnegative(),
        maxStocks: z.number().int().nonnegative(),
      })
      .nullish()
      .transform((value) => value ?? null),
  }),
});
