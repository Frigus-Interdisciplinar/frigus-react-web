import { z } from "zod";

function isAtLeast16YearsOld(date: string) {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 16);
  return date <= cutoff.toISOString().slice(0, 10);
}

export const profileUpdateSchema = z.object({
  name: z
    .string("Nome inválido")
    .trim()
    .min(1, "Informe seu nome.")
    .max(120, "O nome deve ter no máximo 120 caracteres.")
    .optional(),
  birthDate: z
    .iso.date("Informe uma data de nascimento válida.")
    .refine(isAtLeast16YearsOld, "A idade mínima é de 16 anos.")
    .optional(),
  profilePictureUrl: z.url("Endereço da foto inválido.").max(2048).optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
  message: "Informe ao menos um dado para atualizar.",
});

export const profilePictureUploadTicketSchema = z.object({
  uploadUrl: z.url(),
  profilePictureUrl: z.url().max(2048),
});
