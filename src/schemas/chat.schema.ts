import { z } from "zod";

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, "Digite uma mensagem."),
});
