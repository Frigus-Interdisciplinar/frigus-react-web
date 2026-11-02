import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import * as contracts from "@/schemas/api-response.schema";
import { aiChatResponseSchema } from "@/schemas/ai-chat.schema";
import { registerSchema } from "@/schemas/auth.schema";
import { userPreferencesSchema } from "@/schemas/preferences.schema";

const enabled = process.env.RUN_STACK_CONTRACTS === "1";
const base = process.env.FRIGUS_STACK_URL ?? "http://127.0.0.1:5173/api";
const email = process.env.FRIGUS_TEST_EMAIL ?? "codex.demo.20261022@example.test";
const password = process.env.FRIGUS_TEST_PASSWORD;
const ledger: Array<{ method: string; path: string; status: number }> = [];
let cookie = "";
let groupId: string;
let stockId: number;
let productId: number;
let itemId: number;
let conversationId: string;
let recipeId: number;
let originalType = "DOMESTIC";
const suffix = Date.now().toString();
const date = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
const month = new Date().toISOString().slice(0, 7);

async function call(path: string, method = "GET", body?: unknown, expectedStatus?: number) {
  const res = await fetch(base + path, {
    method, headers: { "Content-Type": "application/json", Origin: "http://localhost:5173", Cookie: cookie,
      ...(method === "POST" ? { "Idempotency-Key": randomUUID() } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(125000),
  });
  ledger.push({ method, path, status: res.status });
  if (path === "/web/auth/login") cookie = res.headers.getSetCookie().map(v => v.split(";")[0]).join("; ");
  const text = await res.text();
  if (!res.ok && res.status !== expectedStatus) throw new Error(`${method} ${path}: HTTP ${res.status} ${text.slice(0, 1500)}`);
  return text ? JSON.parse(text) : undefined;
}
const core = (path: string, method?: string, body?: unknown) => call("/web/core" + path, method, body);
function localSql(query: string) {
  return execFileSync("docker", ["exec", "frigus-local-postgres-1", "psql", "-v", "ON_ERROR_STOP=1", "-U", "frigus", "-d", "frigus", "-Atc", query], { encoding: "utf8" }).trim();
}
function account(type: string) {
  if (!["DOMESTIC", "COMMERCIAL", "BUSINESS"].includes(type)) throw new Error("Unknown account type");
  localSql(`update users set account_type='${type}' where email='${email}';`);
}

describe.skipIf(!enabled)("Compose: chamadas reais das telas pelo proxy Web → BFF → Core", () => {
  beforeAll(async () => {
    if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname) || !email.endsWith("@example.test") || !/^[a-zA-Z0-9.@_-]+$/.test(email)) throw new Error("Smoke tests are restricted to the local demo account.");
    if (!password) throw new Error("Set FRIGUS_TEST_PASSWORD for the existing demo user.");
    originalType = localSql(`select account_type from users where email='${email}';`);
    account("DOMESTIC");
    const login = contracts.loginResponseSchema.parse(await call("/web/auth/login", "POST", { email, rawPassword: password }));
    expect(login.user.email).toBe(email);
    const context = contracts.inventoryContextResponseSchema.parse(await core("/inventory/active-context"));
    groupId = context.groupId;
    stockId = context.stocks[0].id;
  }, 30000);
  afterAll(() => {
    if (enabled && originalType) account(originalType);
    mkdirSync("docs", { recursive: true });
    writeFileSync("docs/stack-contract-results.json", JSON.stringify({ at: new Date().toISOString(), source: base, emailCapture: process.env.FRIGUS_EMAIL_CAPTURE === "1", requests: ledger }, null, 2));
  });

  it("cadastro com o contrato do formulário e nascimento convertido", async () => {
    const body = registerSchema.parse({ name: "A", email: `register.${suffix}@example.test`, birthDate: "1990-05-15", rawPassword: password });
    const user = contracts.registerResponseSchema.parse(await call("/web/auth/register", "POST", body));
    expect(user.name).toBe("A");
    expect(user.birthDate).toBe("15/05/1990");
  });

  it("Home, perfil, família, estoque, alertas e notificações", async () => {
    contracts.authUserResponseSchema.parse(await call("/web/profile"));
    const groups = z.array(contracts.groupResponseSchema).parse(await core("/groups"));
    expect(groups[0].members?.[0].role).toBeTruthy();
    contracts.stockSummaryResponseSchema.parse(await core("/inventory/summary"));
    const page = await core(`/inventory/stocks/${stockId}/products?size=100`);
    z.array(contracts.stockProductResponseSchema).parse(page.content);
    contracts.notificationPageResponseSchema.parse(await core("/notifications?size=20"));
    contracts.notificationPageResponseSchema.parse(await core("/notifications/unread?size=20"));
    expect((await core("/notifications/unread-count")).count).toBeTypeOf("number");
    z.array(contracts.advertisementResponseSchema).parse((await core("/advertisements/active")).content);
  });

  it("adiciona produto sem marca/imagem e lote sem código/mínimo, edita e registra movimento", async () => {
    const product = contracts.productResponseSchema.parse(await core(`/groups/${groupId}/products`, "POST", {
      name: `Arroz contrato ${suffix}`, category: "GRAIN", storagePlace: "PANTRY", unitPrice: 9.99, unitOfMeasure: "KILOGRAM",
    }));
    productId = product.id;
    expect(product.brand).toBeUndefined();
    expect(product.imageUrl).toBeUndefined();
    const item = contracts.stockProductResponseSchema.parse(await core("/inventory/stock-products", "POST", {
      productId, stockId, quantity: 0, expireDate: date,
    }));
    itemId = item.id;
    expect(item.minimalQuantity).toBeUndefined();
    expect(item.batch).toBeUndefined();
    const edited = contracts.stockProductResponseSchema.parse(await core(`/inventory/stock-products/${itemId}`, "PUT", { quantity: 6, batch: "CONTRACT", minimalQuantity: 2 }));
    expect(edited.batch).toBe("CONTRACT");
    expect(edited.quantity).toBe(6);
    await core(`/inventory/stock-products/${itemId}/movements`, "POST", { movementType: "OUT", quantity: 1 });
    z.array(contracts.stockMovementResponseSchema).parse((await core(`/inventory/stock-products/${itemId}/movements`)).content);
    contracts.stockProductResponseSchema.parse(await core(`/inventory/stock-products/${itemId}`));
    z.array(contracts.productResponseSchema).parse(await core(`/groups/${groupId}/products`));
  });

  it("cria e conclui lista sem data e fornecedor opcionais", async () => {
    const list = contracts.shoppingListResponseSchema.parse(await core("/shopping-lists", "POST", { name: `Lista contrato ${suffix}`, stockId }));
    const item = contracts.shoppingListItemResponseSchema.parse(await core(`/shopping-lists/${list.id}/items`, "POST", { productId, quantity: 2 }));
    await core(`/shopping-lists/${list.id}/items/${item.id}`, "PATCH", { quantity: 3 });
    await core(`/shopping-lists/${list.id}/items/${item.id}`, "PATCH", { status: "PURCHASED" });
    const completed = contracts.shoppingListResponseSchema.parse(await core(`/shopping-lists/${list.id}/complete`, "POST", {}));
    expect(completed.status).toBe("COMPLETED");
    expect(completed.supplier).toBeUndefined();
    contracts.shoppingListPageResponseSchema.parse(await core(`/shopping-lists?stockId=${stockId}`));
    z.array(contracts.shoppingListSuggestionResponseSchema).parse(await core(`/shopping-lists/suggestions?stockId=${stockId}`));
  });

  it("cria conversa vazia e envia e lista mensagem", async () => {
    z.array(contracts.conversationResponseSchema).parse(await core("/chat/conversations"));
    const conversation = contracts.conversationResponseSchema.parse(await core("/chat/conversations/group", "POST", { groupId, name: `Conversa contrato ${suffix}` }));
    conversationId = conversation.id;
    expect(conversation.latestMessage).toBeUndefined();
    const msg = contracts.chatMessageResponseSchema.parse(await core(`/chat/conversations/${conversationId}/messages`, "POST", { content: "Mensagem de teste de contrato", messageType: "TEXT" }));
    expect(msg.content).toBe("Mensagem de teste de contrato");
    z.array(contracts.chatMessageResponseSchema).parse((await core(`/chat/conversations/${conversationId}/messages`)).content);
  });

  it("plano e checkout de demonstração", async () => {
    const plans = await core("/plans");
    expect(Array.isArray(plans)).toBe(true);
    const paid = plans.find((p: { price: number; planCode: string }) => p.price > 0 && p.planCode === "PLUS");
    expect(paid).toBeTruthy();
    const transaction = contracts.transactionResponseSchema.parse(await core("/transactions/checkout", "POST", { planCode: paid.planCode, paymentMethod: "PIX", fakePixKey: `frigus-${randomUUID()}` }));
    let status = transaction.status;
    for (let attempt = 0; status !== "APPROVED" && attempt < 40; attempt++) {
      await new Promise(resolve => setTimeout(resolve, 250));
      status = contracts.transactionResponseSchema.parse(await core(`/transactions/${transaction.id}`)).status;
    }
    expect(status).toBe("APPROVED");
    // The new access token must carry the plan activated by the local fake payment worker.
    await call("/web/auth/login", "POST", { email, rawPassword: password });
    await call("/web/plans/subscription");
  });

  it("receitas, favoritos e sugestões", async () => {
    const recipes = (await core("/recipes?size=10")).content;
    z.array(contracts.recipeSummaryResponseSchema).parse(recipes);
    z.array(contracts.recipeSummaryResponseSchema).parse((await core("/recipes/favorites")).content);
    await core(`/recipes/suggestions?stockId=${stockId}`);
    recipeId = Number(localSql(`insert into recipes(name,domestic_only,active) values('Receita contrato ${suffix}',true,true) returning id;`).split("\n")[0]);
    localSql(`insert into recipe_ingredients(recipe_id,product_id,quantity,unit,required) values(${recipeId},${productId},null,null,true);`);
    const recipe = contracts.recipeResponseSchema.parse(await core(`/recipes/${recipeId}`));
    expect(recipe.description).toBeUndefined();
    expect(recipe.instructions).toBeUndefined();
    await core(`/recipes/${recipeId}/favorite`, "PUT");
    await core(`/recipes/${recipeId}/favorite`, "DELETE");
  });

  it("preferências persistidas e marcação de notificações", async () => {
    const previous = userPreferencesSchema.parse(await core("/preferences"));
    const saved = userPreferencesSchema.parse(await core("/preferences", "PUT", { ...previous, theme: "LIGHT" }));
    expect(saved.theme).toBe("LIGHT");
    await core("/preferences", "PUT", previous);
    await core("/notifications/read-all", "PATCH");
  });

  it("perdas sem motivo opcional", async () => {
    contracts.discardResponseSchema.parse(await core("/discards", "POST", { stockProductId: itemId, quantity: 1 }));
    z.array(contracts.discardResponseSchema).parse((await core("/discards?size=100")).content);
  });

  it("telas comerciais: despesas sem fornecedor, equipe e relatório", async () => {
    account("COMMERCIAL");
    try {
      contracts.expenseResponseSchema.parse(await core(`/commercial/groups/${groupId}/expenses`, "POST", { description: "Despesa contrato", category: "Compras", amount: 12.34, expenseDate: date }));
      z.array(contracts.expenseResponseSchema).parse((await core(`/commercial/groups/${groupId}/expenses`)).content);
      z.array(contracts.employeeResponseSchema).parse(await core(`/commercial/groups/${groupId}/employees`));
      z.array(contracts.invitationResponseSchema).parse(await core(`/groups/${groupId}/invitations`));
      const report = contracts.monthlyReportResponseSchema.parse(await core(`/commercial/groups/${groupId}/reports/monthly?month=${month}`));
      expect(report.completedPurchases).toBeGreaterThan(0);
      if (process.env.FRIGUS_EMAIL_CAPTURE === "1") {
        const invitation = contracts.invitationResponseSchema.parse(await core(`/commercial/groups/${groupId}/employees/invitations`, "POST", { email: `contract.${suffix}@example.test`, memberRole: "VIEWER" }));
        expect(invitation.name).toBeUndefined();
      }
    } finally { account("DOMESTIC"); }
  });

  it("telas empresariais: anúncio sem preço, destino e datas opcionais", async () => {
    account("BUSINESS");
    try {
      const ad = contracts.advertisementResponseSchema.parse(await core("/advertisements", "POST", {
        name: `Campanha contrato ${suffix}`, productName: "Arroz", category: "Mercearia", description: "Produto de demonstração",
        imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
      }));
      expect(ad.price).toBeUndefined();
      z.array(contracts.advertisementResponseSchema).parse((await core("/advertisements/mine")).content);
      await core(`/advertisements/${ad.id}/status`, "PATCH", { status: "ACTIVE" });
      await core(`/advertisements/${ad.id}/impressions`, "POST");
      await core(`/advertisements/${ad.id}/clicks`, "POST");
      await core(`/advertisements/${ad.id}/status`, "PATCH", { status: "PAUSED" });
      await core(`/advertisements/${ad.id}/status`, "PATCH", { status: "ARCHIVED" });
    } finally { account("DOMESTIC"); }
  });


  it("recuperação por e-mail capturado, código válido e rejeição de código incorreto", async () => {
    if (process.env.FRIGUS_EMAIL_CAPTURE !== "1") return;
    await call("/web/auth/forgot-password", "POST", { email });
    const messages = await (await fetch("http://127.0.0.1:38080/messages")).json();
    const recovery = messages.filter((m: { to: Array<{ email: string }>; subject: string }) => m.to.some(to => to.email === email) && m.subject.includes("redefinir")).at(-1);
    const code = recovery?.textContent.match(/\b\d{6}\b/)?.[0];
    expect(code).toBeTruthy();
    await call("/web/auth/verify-reset-code", "POST", { email, code });
    const invalidCode = code === "000000" ? "111111" : "000000";
    const failure = await call("/web/auth/reset-password", "POST", { email, code: invalidCode, newPassword: password }, 400);
    expect(failure.status).toBe(400);
  });

  it("tela IA: mensagem pela API principal com o estoque do usuário", async () => {
    const reply = aiChatResponseSchema.parse(await core("/ai/recipes/chat", "POST", { stockId, message: "Quais alimentos há no meu estoque?" }));
    expect(reply.sessionId).toBeTruthy();
    expect(reply.chatMessage?.trim()).toBeTruthy();
  }, 150000);
});

