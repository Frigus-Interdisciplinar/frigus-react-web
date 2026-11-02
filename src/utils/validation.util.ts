import { z } from "zod";

export function validateForm<Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): z.output<Schema> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const messages = result.error.issues.map((issue) => {
    const field = issue.path.length ? `${String(issue.path[0])}: ` : "";
    return `${field}${issue.message}`;
  });
  throw new Error(messages.join(" "));
}

export function sanitizeText(value: string, maxLength = Number.MAX_SAFE_INTEGER): string {
  return [...value.normalize("NFKC")]
    .filter((character) => {
      const code = character.codePointAt(0) ?? 0;
      return code >= 0x20 && code !== 0x7f;
    })
    .join("")
    .trim()
    .slice(0, maxLength);
}
