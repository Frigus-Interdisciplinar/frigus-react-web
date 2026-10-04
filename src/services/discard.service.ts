import { z } from "zod";
import { discardSchema, discardInputSchema, pageSchema, type Paging } from "@/schemas/api.schema";
import { request, query } from "./request";
export const discardService = {
  list: (paging?: Paging) => request(pageSchema(discardSchema), "/web/core/discards", "GET", undefined, query(paging)),
  create: (data: z.input<typeof discardInputSchema>) => request(discardSchema, "/web/core/discards", "POST", discardInputSchema.parse(data)),
};
