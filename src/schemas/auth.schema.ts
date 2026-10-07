import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  rawPassword: z.string("Senha inválida").min(1, "Senha deve ser preenchida"),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
  name: z.string("Nome inválido").min(1, "O nome é obrigatório"),
  email: z.email("Email inválido"),
  rawPassword: z
    .string("Senha inválida")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,20}$/,
      "A senha deve conter de 8 a 20 caracteres, com letra maiuscula, minuscula, numero e caractere especial",
    ),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use dd/MM/yyyy").refine((value) => {
    const [day, month, year] = value.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, "Data de nascimento inválida"),
});

export type LoginInput = z.input<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
