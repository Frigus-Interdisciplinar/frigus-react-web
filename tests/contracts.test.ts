import { describe, expect, it } from "vitest";
import { z } from "zod";
import * as response from "@/schemas/api-response.schema";
import { createProductSchema, createStockProductSchema, stockMovementSchema, updateStockProductSchema } from "@/schemas/inventory.schema";
import { discardSchema, employeeInvitationSchema, expenseSchema } from "@/schemas/commercial.schema";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/schemas/auth.schema";
import { advertisementInputSchema } from "@/schemas/advertisement.schema";
import { checkoutSchema } from "@/schemas/checkout.schema";
import { transactionInputSchema } from "@/schemas/transaction.schema";
import { chatMessageSchema } from "@/schemas/chat.schema";
import * as bff from "../../frigus-bff/src/schemas/core-api.schema";

const product = { name: "Arroz", category: "GRAIN", storagePlace: "PANTRY", unitPrice: 12.5, unitOfMeasure: "KILOGRAM" };
const stockItem = { productId: 1, stockId: 1, quantity: 0, expireDate: "2026-12-01" };
const advertisement = { name: "Campanha", productName: "Arroz", category: "Mercearia", description: "Produto da casa", imageUrl: "https://example.test/photo.png" };

describe("Contratos de entrada Web → BFF → Core", () => {
  it.each([
    ["produto sem marca/imagem", createProductSchema, bff.groupProductSchema, product],
    ["produto com marca/imagem", createProductSchema, bff.groupProductSchema, { ...product, brand: "Casa", imageUrl: "https://example.test/product.png" }],
    ["lote sem mínimo/código", createStockProductSchema, bff.stockProductCreateSchema, stockItem],
    ["lote com metadados", createStockProductSchema, bff.stockProductCreateSchema, { ...stockItem, batch: "ABC", minimalQuantity: 0 }],
    ["edição parcial", updateStockProductSchema, bff.stockProductUpdateSchema, { batch: "XYZ" }],
    ["ajuste de saldo zerado", stockMovementSchema, bff.movementSchema, { movementType: "ADJUSTMENT", quantity: 0 }],
    ["movimento com observação", stockMovementSchema, bff.movementSchema, { movementType: "IN", quantity: 1, observation: "Entrada" }],
    ["descarte sem motivo", discardSchema, bff.discardSchema, { stockProductId: 1, quantity: 1 }],
    ["convite sem nome", employeeInvitationSchema, bff.invitationSchema, { email: "demo@example.test", memberRole: "VIEWER" }],
    ["despesa sem fornecedor", expenseSchema, bff.expenseSchema, { description: "Compra", category: "Compra", amount: 12, expenseDate: "2026-10-22" }],
    ["anúncio sem destino/preço/datas", advertisementInputSchema, bff.advertisementSchema, advertisement],
    ["checkout gratuito sem metadados de pagamento", transactionInputSchema, bff.checkoutSchema, { planCode: "FREE" }],
  ] as const)("%s mantém o mesmo payload", (_, frontend, backend, body) => {
    const parsed = frontend.parse(body);
    expect(backend.parse(parsed)).toEqual(parsed);
  });

  it.each([undefined, null, ""])("omite campos opcionais vazios (%s)", value => {
    expect(createProductSchema.parse({ ...product, brand: value }).brand).toBeUndefined();
    expect(employeeInvitationSchema.parse({ email: "a@example.test", memberRole: "EDITOR", name: value }).name).toBeUndefined();
    expect(advertisementInputSchema.parse({ ...advertisement, destinationUrl: value, startDate: value }).destinationUrl).toBeUndefined();
  });

  it("preserva campos obrigatórios e regras de serviço", () => {
    expect(createProductSchema.safeParse({ ...product, unitPrice: 0 }).success).toBe(false);
    expect(createProductSchema.safeParse({ ...product, unitPrice: 1.001 }).success).toBe(false);
    expect(createStockProductSchema.safeParse({ ...stockItem, expireDate: undefined }).success).toBe(false);
    expect(createStockProductSchema.safeParse({ ...stockItem, quantity: 1.5 }).success).toBe(false);
    expect(updateStockProductSchema.safeParse({}).success).toBe(false);
    expect(stockMovementSchema.safeParse({ movementType: "OUT", quantity: 0 }).success).toBe(false);
    expect(bff.movementSchema.safeParse({ movementType: "IN", quantity: 0 }).success).toBe(false);
    expect(bff.stockProductCreateSchema.safeParse({ ...stockItem, quantity: null }).success).toBe(false);
  });

  it("aceita uma senha de login existente sem impor a política de criação", () => {
    expect(loginSchema.safeParse({ email: "demo@example.test", rawPassword: "a" }).success).toBe(true);
  });
  it("converte a data do formulário uma vez e aceita o formato do Core", () => {
    const user = { name: "A", email: "a@example.test", rawPassword: "FrigusDemo2026!", birthDate: "1990-05-15" };
    const parsed = registerSchema.parse(user);
    expect(parsed.birthDate).toBe("15/05/1990");
    expect(registerSchema.parse(parsed).birthDate).toBe("15/05/1990");
    expect(parsed.accountType).toBe("DOMESTIC");
    expect(registerSchema.safeParse({ ...user, birthDate: "2026-02-30" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...user, birthDate: "2020-01-01" }).success).toBe(false);
  });
  it("aplica a mesma política de senha na recuperação", () => {
    expect(resetPasswordSchema.safeParse({ email: "a@example.test", code: "123456", newPassword: "password" }).success).toBe(false);
  });
  it("não exige número de cartão ao escolher Pix", () => {
    expect(checkoutSchema.safeParse({ planCode: "DOMESTIC_PLUS", acceptTerms: true, paymentMethod: "pix" }).success).toBe(true);
    expect(checkoutSchema.safeParse({ planCode: "DOMESTIC_PLUS", acceptTerms: true, paymentMethod: "card" }).success).toBe(false);
  });
  it("confere período do anúncio e os métodos de pagamento do Core", () => {
    const invalid = { ...advertisement, startDate: "2026-12-10", endDate: "2026-12-01" };
    expect(advertisementInputSchema.safeParse(invalid).success).toBe(false);
    expect(bff.advertisementSchema.safeParse(invalid).success).toBe(false);
    const debit = { planCode: "PLUS", paymentMethod: "DEBIT_CARD" };
    expect(bff.checkoutSchema.parse(transactionInputSchema.parse(debit))).toEqual(debit);
  });
  it("não impõe ao texto de chat o limite que o Core não tem", () => {
    expect(chatMessageSchema.parse({ content: "a".repeat(2100) }).content).toHaveLength(2100);
  });
});

describe("Respostas Jackson: campos nullable não bloqueiam as telas", () => {
  const fixtures: Array<[string, z.ZodType, object, Record<string, unknown>]> = [
    ["produto", response.productResponseSchema, { ...product, id: 1 }, { brand: null, imageUrl: null, ownerGroupId: null }],
    ["estoque", response.stockProductResponseSchema, { ...stockItem, id: 1, category: "GRAIN" }, { minimalQuantity: null, batch: null, productStatus: null, product: null }],
    ["movimentação", response.stockMovementResponseSchema, { id: 1, movementType: "IN", quantity: 1 }, { date: null, observation: null, balanceAfter: null }],
    ["mensagem com anexo", response.chatMessageResponseSchema, { id: 1, conversationId: "id", senderId: "id", senderName: "A" }, { content: null, messageType: null, attachments: null, createdAt: null }],
    ["conversa vazia", response.conversationResponseSchema, { id: "id", conversationType: "PRIVATE" }, { groupId: null, groupName: null, name: null, latestMessage: null }],
    ["usuário Google/legado", response.authUserResponseSchema, { id: "id", name: "A", email: "a@example.test", accountType: "DOMESTIC" }, { birthDate: null, profilePictureUrl: null }],
    ["convite", response.invitationResponseSchema, { id: "id", email: "a@example.test" }, { name: null, acceptedAt: null, revokedAt: null }],
    ["grupo", response.groupResponseSchema, { id: "id", name: "Casa" }, { bannerPicture: null, members: null }],
    ["anúncio", response.advertisementResponseSchema, { ...advertisement, id: "id", advertiserId: "id", advertiserName: "A", status: "DRAFT", impressions: 0, clicks: 0, createdAt: "now", updatedAt: "now" }, { destinationUrl: null, price: null, startDate: null, endDate: null }],
    ["receita", response.recipeResponseSchema, { id: 1, name: "Receita", favorite: false }, { description: null, instructions: null, ingredients: null }],
    ["ingrediente", response.recipeIngredientResponseSchema, { id: 1 }, { quantity: null, unit: null, required: null, inStock: null }],
    ["lista de compras", response.shoppingListResponseSchema, { id: "id", stockId: 1, name: "Lista", status: "OPEN", items: [] }, { supplier: null, total: null, completedAt: null }],
    ["item comprado", response.shoppingListItemResponseSchema, { id: 1, product: { id: 1, name: "A", category: "GRAIN", unitOfMeasure: "UNIT" }, quantity: 1, status: "PENDING" }, { purchasedUnitPrice: null }],
    ["despesa", response.expenseResponseSchema, { id: "id", description: "A", category: "A", amount: 1, expenseDate: "2026-10-22" }, { supplier: null }],
    ["descarte", response.discardResponseSchema, { id: 1, stockProductId: 1, quantity: 1, date: "now" }, { reason: null }],
    ["anexo legado", response.attachmentResponseSchema, { id: 1, fileUrl: "url", mimeType: "image/png" }, { fileName: null, fileSize: null, createdAt: null }],
  ];
  it.each(fixtures)("%s aceita ausência e null nos campos opcionais", (_, schema, required, nullable) => {
    expect(schema.safeParse(required).success).toBe(true);
    expect(schema.safeParse({ ...required, ...nullable }).success).toBe(true);
    expect(schema.safeParse({ ...required, id: undefined }).success).toBe(false);
  });
  it("usa memberRole/isOwner da API para exibir o papel do membro", () => {
    expect(response.groupMemberResponseSchema.parse({ userId: "id", name: "A", email: "a@example.test", memberRole: "EDITOR", isOwner: true }).role).toBe("OWNER");
  });
});

