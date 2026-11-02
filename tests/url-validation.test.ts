import { afterEach, describe, expect, it, vi } from "vitest";
import { safeHttpUrl } from "@/utils/url.util";
import { transactionResponseSchema } from "@/schemas/api-response.schema";

afterEach(() => vi.unstubAllGlobals());

describe("URLs renderizadas", () => {
  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)", "file:///etc/passwd", "\njavascript:alert(1)", "", undefined])("recusa esquema executável ou valor ausente: %s", (url) => {
    vi.stubGlobal("window", { location: { origin: "https://frigus.test" } });
    expect(safeHttpUrl(url)).toBeUndefined();
  });
  it("resolve caminhos locais e preserva links HTTP/HTTPS", () => {
    vi.stubGlobal("window", { location: { origin: "https://frigus.test" } });
    expect(safeHttpUrl("/images/arroz.png")).toBe("https://frigus.test/images/arroz.png");
    expect(safeHttpUrl("https://exemplo.test/oferta")).toBe("https://exemplo.test/oferta");
    expect(safeHttpUrl("http://localhost:3000/foto")).toBe("http://localhost:3000/foto");
  });
});

it("recusa estado de pagamento desconhecido, sem exibir espera indefinida", () => {
  expect(transactionResponseSchema.safeParse({ id: "id", status: "desconhecido" }).success).toBe(false);
  expect(transactionResponseSchema.parse({ id: "id", status: "APPROVED" }).status).toBe("APPROVED");
});
