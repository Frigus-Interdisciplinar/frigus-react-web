import { z } from "zod";
import { planSchema, subscriptionSchema, productSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
export const planService = {
  list: () => request(z.array(planSchema), "/web/plans"),
  listProducts: (paging?: Paging) => request(pageSchema(productSchema), "/web/plans/catalog/products", "GET", undefined, query(paging)),
  getSubscription: () => request(subscriptionSchema, "/web/plans/subscription"),
  cancelSubscription: () => request(subscriptionSchema, "/web/plans/subscription/cancel", "POST"),
  reactivateSubscription: () => request(subscriptionSchema, "/web/plans/subscription/reactivate", "POST"),
};
