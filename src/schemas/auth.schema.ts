import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  rawPassword: z.string("Senha inválida").min(8, "Senha inválida"),
});

export const registerSchema = z.object({
  name: z.string("Nome inválido").min(3, "Nome muito curto"),
  email: z.email("Email inválido"),
  rawPassword: z
    .string("Senha inválida")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/,
      "A senha deve conter de 8 a 20 caracteres, com letra maiuscula, minuscula, numero e caractere especial",
    ),
  birthDate: z.coerce
    .date()
    .transform((date) => date.toISOString().split("T")[0]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;