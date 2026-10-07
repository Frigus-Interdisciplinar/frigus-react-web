/// <reference types="node" />
import { env } from "node:process";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import * as contracts from "@/schemas/api.schema";

const baseUrl = env.FRIGUS_INTEGRATION_URL;
// Only enable against the disposable local stack; this suite creates test data.
describe.skipIf(!baseUrl)("contratos reais BFF → core-api", () => {
  it("valida sessão, perfil, catálogo, checkout, assinatura e listagens", async () => {
    expect(baseUrl).toBe("http://localhost:3000");
    await vi.waitFor(async () => {
      const health = await fetch("http://localhost:8080/actuator/health", { signal: AbortSignal.timeout(3000) });
      expect(health.ok).toBe(true);
    }, { timeout: 60000, interval: 1000 });
    const cookies = new Map<string, string>();
    async function call(path: string, method = "GET", body?: unknown, headers: Record<string, string> = {}) {
      const response = await fetch(`${baseUrl}${path}`, {
        method, headers: { "Content-Type": "application/json", Cookie: [...cookies.values()].join("; "), ...headers },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(";")[0];
        cookies.set(pair.split("=")[0], pair);
      }
      if (response.status === 204) return undefined;
      const data = await response.json();
      expect(response.ok, `${method} ${path}: ${JSON.stringify(data)}`).toBe(true);
      return data;
    }
    const email = `integration-${Date.now()}@example.com`;
    const user = contracts.userSchema.parse(await call("/web/auth/register", "POST", { name: "Teste de integração", email, rawPassword: "Frigus123!", birthDate: "01/01/2000" }));
    expect(user.birthDate).toBe("01/01/2000");
    const session = contracts.loginResponseSchema.parse(await call("/web/auth/login", "POST", { email, rawPassword: "Frigus123!" }));
    expect(session.user.id).toBe(user.id);
    expect(contracts.userSchema.parse(await call("/web/profile")).id).toBe(user.id);
    contracts.userSchema.parse(await call("/web/profile", "PATCH", { name: "Teste atualizado" }));
    contracts.loginResponseSchema.parse(await call("/web/auth/refresh", "POST", {}));
    const plans = z.array(contracts.planSchema).parse(await call("/web/plans"));
    expect(plans.find((plan) => plan.planCode === "FREE")?.billingInterval).toBeNull();
    contracts.pageSchema(contracts.productSchema).parse(await call("/web/plans/catalog/products?page=0&size=20"));
    const checkout = contracts.transactionSchema.parse(await call("/web/transactions/checkout", "POST", { planCode: "PLUS", paymentMethod: "PIX", fakePixKey: "integration@example.com" }, { "Idempotency-Key": `integration-${Date.now()}` }));
    let transaction = checkout;
    for (let attempt = 0; attempt < 20 && transaction.status !== "APPROVED"; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      transaction = contracts.transactionSchema.parse(await call(`/web/transactions/${checkout.id}`));
    }
    expect(transaction.status).toBe("APPROVED");
    contracts.pageSchema(contracts.transactionSchema).parse(await call("/web/transactions"));
    contracts.subscriptionSchema.parse(await call("/web/plans/subscription"));
    const groups = z.array(contracts.groupSchema).parse(await call("/web/core/groups"));
    expect(groups).toHaveLength(0);
    const group = contracts.groupSchema.parse(await call("/web/core/groups", "POST", { name: "Grupo de integração" }));
    expect(group.defaultConversationId).toBeTruthy();
    const stock = contracts.stockSchema.parse(await call("/web/core/inventory/stocks", "POST", { groupId: group.id, name: "Cozinha" }));
    expect(stock.groupId).toBe(group.id);
    const message = contracts.messageSchema.parse(await call(`/web/core/chat/conversations/${group.defaultConversationId}/messages`, "POST", { content: "Fluxo web integrado" }));
    expect(message.conversationId).toBe(group.defaultConversationId);
    contracts.pageSchema(contracts.discardSchema).parse(await call("/web/core/discards"));
    z.array(contracts.conversationSchema).parse(await call("/web/core/chat/conversations"));
    contracts.subscriptionSchema.parse(await call("/web/plans/subscription/cancel", "POST"));
    contracts.subscriptionSchema.parse(await call("/web/plans/subscription/reactivate", "POST"));
    expect(await call("/web/auth/logout", "POST", {})).toBeUndefined();
    expect(cookies.get("accessToken")).toBe("accessToken=");
  }, 90000);
});
