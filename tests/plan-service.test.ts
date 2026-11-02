import { beforeEach, expect, it, vi } from "vitest";
import { finishPlanSelection, listPlans } from "@/services/plan.service";
import { ensureStarterWorkspace, refreshSession } from "@/services/auth.service";
import { api } from "@/utils/api.util";
import { getSessionDestination, resolveCheckoutPlanCode } from "@/utils/plan.util";

vi.mock("@/services/auth.service", () => ({ ensureStarterWorkspace: vi.fn(), refreshSession: vi.fn() }));
vi.mock("@/utils/api.util", () => ({ api: { get: vi.fn() } }));

beforeEach(() => vi.resetAllMocks());

it("não conclui a conta se o servidor ainda exige a escolha de plano", async () => {
  vi.mocked(refreshSession).mockResolvedValue({ user: { id: "u", name: "A", email: "a@example.test", accountType: "DOMESTIC", planSelectionRequired: true } });
  await expect(finishPlanSelection()).rejects.toThrow("ativação do plano ainda não foi confirmada");
  expect(ensureStarterWorkspace).not.toHaveBeenCalled();
});

it("usa a sessão renovada e só retorna após preparar o espaço", async () => {
  const user = { id: "u", name: "A", email: "a@example.test", accountType: "BUSINESS" as const, planSelectionRequired: false };
  vi.mocked(refreshSession).mockResolvedValue({ user });
  vi.mocked(ensureStarterWorkspace).mockResolvedValue({ id: "group", name: "Empresa" });
  const controller = new AbortController();
  expect(await finishPlanSelection(controller.signal)).toEqual(user);
  expect(refreshSession).toHaveBeenCalledWith(controller.signal);
  expect(ensureStarterWorkspace).toHaveBeenCalledWith("BUSINESS", controller.signal);
});

it("valida o catálogo antes de mostrar preços e recusa valores negativos", async () => {
  vi.mocked(api.get).mockResolvedValue([{ id: 1, planCode: "PLUS", name: "Plus", price: -1, active: true }]);
  await expect(listPlans()).rejects.toBeInstanceOf(Error);
});

it("preserva aliases existentes sem aceitar propriedades herdadas como planos", () => {
  expect(resolveCheckoutPlanCode("family-plus")).toBe("PLUS");
  expect(resolveCheckoutPlanCode("ENTERPRISE")).toBe("ENTERPRISE");
  expect(resolveCheckoutPlanCode("__proto__")).toBeUndefined();
  expect(resolveCheckoutPlanCode("enterprise-ad")).toBeUndefined();
});

it("retoma a transação pendente após restaurar a sessão", () => {
  expect(getSessionDestination({ id: "u", name: "A", email: "a@example.test", accountType: "COMMERCIAL", planSelectionRequired: true, pendingPlanTransactionId: "tx" })).toBe("/checkout/webview/success?transactionId=tx");
});
