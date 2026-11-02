import { z } from "zod";
import { money, optionalText, positiveId, requiredText } from "./common.schema";

export const discardSchema = z.object({
  stockProductId: positiveId,
  quantity: positiveId,
  reason: optionalText(2000),
});
export const expenseSchema = z.object({
  description: requiredText("Descrição", 255),
  category: requiredText("Categoria", 120),
  amount: money(9999999999.99, false),
  expenseDate: z.iso.date("Informe uma data válida."),
  supplier: optionalText(255),
});
export const employeeInvitationSchema = z.object({
  name: optionalText(255),
  email: z.email("Informe um e-mail válido.").max(255),
  memberRole: z.enum(["EDITOR", "VIEWER"]),
});