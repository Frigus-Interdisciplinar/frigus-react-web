import { z } from "zod";
// TODO core-api/BFF: recovery by email has no public endpoint yet.
export async function requestPasswordRecovery(email: string) {
  z.email("Email inválido").parse(email);
  return { mocked: true as const };
}
