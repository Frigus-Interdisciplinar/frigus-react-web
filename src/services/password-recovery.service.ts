import { z } from "zod";
import { registerSchema } from "@/schemas/auth.schema";
import { api } from "@/utils/api.util";

const emailSchema = z.object({
  email: z.email("Email inválido"),
});

const recoveryCodeSchema = z.object({
  email: z.email("Email inválido"),
  code: z.string().regex(/^\d{6}$/, "Digite os 6 dígitos do código"),
});

const resetSchema = recoveryCodeSchema.extend({
  newPassword: registerSchema.shape.rawPassword,
});

export async function requestPasswordRecovery(email: string) {
  const payload = emailSchema.parse({ email });
  await api<void>("/web/auth/forgot-password", "POST", payload);
}

export async function resetPassword(
  input: z.input<typeof resetSchema>,
) {
  const payload = resetSchema.parse(input);
  await api<void>("/web/auth/reset-password", "POST", payload);
}

export async function verifyPasswordRecoveryCode(
  input: z.input<typeof recoveryCodeSchema>,
) {
  const payload = recoveryCodeSchema.parse(input);
  await api<void>("/web/auth/verify-reset-code", "POST", payload);
}
