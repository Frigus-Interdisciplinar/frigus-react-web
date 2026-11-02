import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Email inválido")
    .max(254, "E-mail deve ter no máximo 254 caracteres."),
  rawPassword: z
    .string("Senha inválida")
    .min(1, "Informe a senha")
    .max(128, "Senha inválida"),
  rememberMe: z.boolean().optional(),
});

export const googleLoginSchema = z.object({
  idToken: z.string().trim().min(1).max(8192),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string("Nome inválido").trim().min(1, "Informe o nome"),
  email: z
    .email("Email inválido")
    .max(254, "E-mail deve ter no máximo 254 caracteres."),
  rawPassword: z
    .string("Senha inválida")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/,
      "A senha deve conter de 8 a 20 caracteres, com letra maiuscula, minuscula, numero e caractere especial",
    ),
  birthDate: z
    .string()
    .transform((value) => {
      const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      return parts ? `${parts[3]}-${parts[2]}-${parts[1]}` : value;
    })
    .pipe(z.iso.date("Informe uma data de nascimento válida."))
    .refine((value) => {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 16);
      return value <= cutoff.toISOString().slice(0, 10);
    }, "A idade mínima é de 16 anos.")
    .transform((value) => value.split("-").reverse().join("/")),
  accountType: z
    .enum(["DOMESTIC", "COMMERCIAL", "BUSINESS"])
    .default("DOMESTIC"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const passwordRecoverySchema = z.object({
  email: z
    .email("Informe um e-mail válido.")
    .max(254, "E-mail deve ter no máximo 254 caracteres."),
});
export const recoveryCodeSchema = z.object({
  email: z.email("Informe um e-mail válido.").max(254, "E-mail inválido."),
  code: z.string().regex(/^\d{6}$/, "Informe o código de seis dígitos."),
});
export const resetPasswordSchema = recoveryCodeSchema.extend({
  newPassword: registerSchema.shape.rawPassword,
});
