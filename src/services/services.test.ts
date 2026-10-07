import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { api } from "@/utils/api.util";
import { register, logout } from "./auth.service";
import { inventoryService } from "./inventory.service";
import { groupService } from "./group.service";
import { chatService } from "./chat.service";
import { transactionService } from "./transaction.service";
import { userService } from "./user.service";
import { requestPasswordRecovery, resetPassword, verifyPasswordRecoveryCode } from "./password-recovery.service";
import { useStore } from "@/store/store";
import { groupSchema, conversationSchema } from "@/schemas/api.schema";

vi.mock("@/utils/api.util", () => ({
  api: vi.fn(),
  ApiError: class extends Error {
    constructor(message: string, public status?: number, public code?: string) { super(message); }
  },
}));
const mockedApi = vi.mocked(api);
const uuid = "00000000-0000-4000-8000-000000000001";
const now = "2026-10-01T12:00:00Z";
const user = { id: uuid, name: "Teste", email: "teste@example.com", birthDate: "01/01/2000", accountType: "DOMESTIC" as const };
const product = { id: 1, productId: 2, stockId: 3, quantity: 4, minimalQuantity: null, expireDate: "2026-10-10", productStatus: "FRESH", category: "FRUIT" };
const page = { content: [product], totalElements: 1, totalPages: 1, size: 20, number: 0 };
beforeEach(() => { vi.clearAllMocks(); useStore.getState().logout(); });

describe("contratos e rotas do BFF", () => {
  it("envia cadastro em dd/MM/yyyy sem campos extras", async () => {
    mockedApi.mockResolvedValue(user);
    await register({ name: "Teste", email: user.email, rawPassword: "Teste123!", birthDate: "01/01/2000" });
    expect(mockedApi).toHaveBeenCalledWith("/web/auth/register", "POST", expect.objectContaining({ birthDate: "01/01/2000" }), undefined);
    await expect(register({ name: "Teste", email: user.email, rawPassword: "Teste123!", birthDate: "2000-01-01" })).rejects.toBeInstanceOf(z.ZodError);
    await expect(register({ name: "Teste", email: user.email, rawPassword: "Teste123!", birthDate: "31/02/2000" })).rejects.toBeInstanceOf(z.ZodError);
    expect(mockedApi).toHaveBeenCalledTimes(1);
  });
  it("preserva paginação e aceita campos opcionais nulos", async () => {
    mockedApi.mockResolvedValue(page);
    expect(await inventoryService.listProducts(3, { page: 0, size: 20 })).toEqual(page);
    expect(mockedApi).toHaveBeenCalledWith("/web/core/inventory/stocks/3/products", "GET", undefined, { params: { page: 0, size: 20 } });
  });
  it("recusa respostas incompatíveis sem substituir por mock", async () => {
    mockedApi.mockResolvedValue({ ...product, quantity: "4" });
    await expect(inventoryService.getProduct(1)).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });
  it("recusa IDs e movimentos inválidos antes de chamar o servidor", () => {
    expect(() => groupService.get("invalido")).toThrow();
    expect(() => inventoryService.createMovement(1, { movementType: "OUT", quantity: -1 })).toThrow();
    expect(mockedApi).not.toHaveBeenCalled();
  });
  it("valida membros reais (isOwner), sem exigir role inexistente", () => {
    expect(groupSchema.parse({ id: uuid, ownerId: uuid, ownerName: "Teste", isOwner: true, name: "Casa", defaultConversationId: null, bannerPicture: null, membersCount: 1, members: [{ userId: uuid, name: "Teste", email: user.email, isOwner: true, joinedAt: now }], createdAt: now, updatedAt: null }).members[0].isOwner).toBe(true);
  });
  it("aceita conversa sem grupo ou última mensagem", () => {
    expect(conversationSchema.parse({ id: uuid, conversationType: "PRIVATE", groupId: null, groupName: null, name: null, pairKey: null, participants: [], latestMessage: null, createdAt: now, updatedAt: null }).latestMessage).toBeNull();
  });
  it("envia mensagem pelo contrato REST disponível", async () => {
    mockedApi.mockResolvedValue({ id: 1, conversationId: uuid, senderId: uuid, senderName: "Teste", messageType: "TEXT", content: "Olá", relatedShoppingListProductId: null, createdAt: now, updatedAt: null });
    await chatService.sendMessage(uuid, { content: "Olá", messageType: "TEXT" });
    expect(mockedApi).toHaveBeenCalledWith(`/web/core/chat/conversations/${uuid}/messages`, "POST", { content: "Olá", messageType: "TEXT" }, undefined);
  });
  it("preserva a chave de idempotência fornecida no checkout", async () => {
    mockedApi.mockResolvedValue({ id: uuid, status: "PENDING", amount: 20, paymentMethod: "PIX", planCode: "PLUS", createdAt: now });
    await transactionService.checkout({ planCode: "PLUS", paymentMethod: "PIX" }, "checkout-1");
    expect(mockedApi).toHaveBeenCalledWith("/web/transactions/checkout", "POST", { planCode: "PLUS", paymentMethod: "PIX" }, { headers: { "Idempotency-Key": "checkout-1" } });
  });
  it("manda email como query e reconhece 204 no logout", async () => {
    mockedApi.mockResolvedValueOnce(user).mockResolvedValueOnce("");
    await userService.findByEmail(user.email);
    expect(mockedApi).toHaveBeenCalledWith("/web/user/search", "GET", undefined, { params: { email: user.email } });
    useStore.getState().login(user, "access", "refresh");
    await logout();
    expect(useStore.getState().user).toBeNull();
  });
  it("solicita, valida código e redefine a senha usando o contrato do BFF", async () => {
    mockedApi.mockResolvedValue(undefined);
    await requestPasswordRecovery(user.email);
    expect(mockedApi).toHaveBeenLastCalledWith(
      "/web/auth/forgot-password",
      "POST",
      { email: user.email },
    );
    await verifyPasswordRecoveryCode({ email: user.email, code: "123456" });
    expect(mockedApi).toHaveBeenLastCalledWith(
      "/web/auth/verify-reset-code",
      "POST",
      { email: user.email, code: "123456" },
    );
    await resetPassword({
      email: user.email,
      code: "123456",
      newPassword: "NewPassword123!",
    });
    expect(mockedApi).toHaveBeenLastCalledWith(
      "/web/auth/reset-password",
      "POST",
      { email: user.email, code: "123456", newPassword: "NewPassword123!" },
    );
    expect(mockedApi).toHaveBeenCalledTimes(3);
  });
});
