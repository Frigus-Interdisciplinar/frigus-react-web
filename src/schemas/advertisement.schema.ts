import { z } from "zod";
import { money, optionalInput } from "./common.schema";

const httpsUrl = z
  .url("Informe uma URL válida.")
  .max(2048)
  .refine(
    (value) => new URL(value).protocol === "https:",
    "Use uma URL HTTPS.",
  );

export const advertisementInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Informe o nome do anúncio.")
      .max(120, "Use no máximo 120 caracteres."),
    productName: z
      .string()
      .trim()
      .min(1, "Informe o produto.")
      .max(160, "Use no máximo 160 caracteres."),
    category: z
      .string()
      .trim()
      .min(1, "Informe a categoria.")
      .max(80, "Use no máximo 80 caracteres."),
    description: z
      .string()
      .trim()
      .min(1, "Informe a descrição.")
      .max(2000, "Use no máximo 2.000 caracteres."),
    imageUrl: httpsUrl,
    destinationUrl: optionalInput(httpsUrl),
    price: optionalInput(money(9999999999.99)),
    startDate: optionalInput(z.iso.date("Informe uma data válida.")),
    endDate: optionalInput(z.iso.date("Informe uma data válida.")),
  })
  .refine((v) => !v.startDate || !v.endDate || v.endDate >= v.startDate, {
    path: ["endDate"],
    message: "A data final precisa ser igual ou posterior à data inicial.",
  });
