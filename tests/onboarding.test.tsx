// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import PlanSelection from "@/components/PlanSelection";
import RegisterPage from "@/pages/Auth/Register";
import LoginPage from "@/pages/Auth/Login";
import CheckoutPage from "@/pages/Payment/CheckoutPage";
import PaymentStatusPage from "@/pages/Payment/WebViewSuccess";
import { login, register, ensureStarterWorkspace, refreshSession } from "@/services/auth.service";
import { listPlans, finishPlanSelection } from "@/services/plan.service";
import { createCheckoutTransaction, getTransaction } from "@/services/transaction.service";
import { useStore } from "@/store/store";
import type { AuthUser, AccountType } from "@/types/auth.type";
import type { Plan } from "@/schemas/plan.schema";

vi.mock("@/hooks/useTheme", () => ({ useTheme: () => ({ theme: "light", toggleTheme: vi.fn(), setTheme: vi.fn() }) }));
vi.mock("@/services/auth.service", () => ({ register: vi.fn(), login: vi.fn(), ensureStarterWorkspace: vi.fn(), refreshSession: vi.fn() }));
vi.mock("@/services/plan.service", () => ({ listPlans: vi.fn(), finishPlanSelection: vi.fn() }));
vi.mock("@/services/transaction.service", () => ({ createCheckoutTransaction: vi.fn(), getTransaction: vi.fn() }));

const transactionId = "ba2b929e-4772-4d54-a13c-562e81896722";
const newUser: AuthUser = { id: "user", name: "Pessoa de teste", email: "teste@example.test", accountType: "DOMESTIC", planSelectionRequired: true };
const activeUser = { ...newUser, planSelectionRequired: false };
const catalog: Plan[] = [
  ["FREE", "Gratuito API", 0], ["PLUS", "Plus API", 37.57], ["FAMILY", "Família API", 55.5],
  ["COMMERCIAL", "Comercial API", 120], ["ENTERPRISE", "Empresarial API", 160],
].map(([planCode, name, price], index) => ({ id: index + 1, planCode: String(planCode), name: String(name), price: Number(price), active: true, description: "Descrição do catálogo", billingInterval: "MONTHLY", benefits: [] }));

function Location() {
  const location = useLocation();
  return <output data-testid="route">{location.pathname}{location.search}</output>;
}

function renderFlow(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><AuthProvider><Location /><Routes>
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/plans/domestic" element={<AuthGuard allowPlanSelection accountType="DOMESTIC"><PlanSelection accountType="DOMESTIC" /></AuthGuard>} />
    <Route path="/plans/commercial" element={<AuthGuard allowPlanSelection accountType="COMMERCIAL"><PlanSelection accountType="COMMERCIAL" /></AuthGuard>} />
    <Route path="/plans/enterprise" element={<AuthGuard allowPlanSelection accountType="BUSINESS"><PlanSelection accountType="BUSINESS" /></AuthGuard>} />
    <Route path="/checkout" element={<AuthGuard allowPlanSelection><CheckoutPage /></AuthGuard>} />
    <Route path="/checkout/webview/success" element={<AuthGuard allowPlanSelection><PaymentStatusPage /></AuthGuard>} />
    <Route path="/home" element={<AuthGuard><p>Painel doméstico</p></AuthGuard>} />
    <Route path="/commercial" element={<AuthGuard><p>Painel comercial</p></AuthGuard>} />
    <Route path="/enterprise" element={<AuthGuard><p>Painel empresarial</p></AuthGuard>} />
  </Routes></AuthProvider></MemoryRouter>);
}

beforeEach(() => {
  vi.clearAllMocks();
  useStore.setState({ user: newUser, initialized: true });
  vi.mocked(listPlans).mockResolvedValue(catalog);
  vi.mocked(finishPlanSelection).mockResolvedValue(activeUser);
  vi.mocked(refreshSession).mockResolvedValue({ user: newUser });
  vi.mocked(ensureStarterWorkspace).mockResolvedValue({ id: "group", name: "Casa" });
  vi.mocked(createCheckoutTransaction).mockResolvedValue({ id: transactionId, status: "APPROVED", planCode: "FREE", amount: 0 });
  vi.mocked(getTransaction).mockResolvedValue({ id: transactionId, status: "PENDING", planCode: "PLUS", amount: 37.57 });
});
afterEach(() => cleanup());

describe("cadastro e login", () => {
  it.each<[AccountType, string]>([["DOMESTIC", "/plans/domestic"], ["COMMERCIAL", "/plans/commercial"], ["BUSINESS", "/plans/enterprise"]])("leva o novo cadastro %s à escolha de planos", async (accountType, path) => {
    useStore.setState({ user: null });
    const account = { ...newUser, accountType };
    vi.mocked(register).mockResolvedValue(account);
    vi.mocked(login).mockResolvedValue({ user: account });
    renderFlow("/register");
    fireEvent.change(screen.getByLabelText("Nome completo"), { target: { value: "Pessoa de teste" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
    fireEvent.change(screen.getByLabelText("Data de nascimento"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText("Tipo de conta"), { target: { value: accountType } });
    fireEvent.change(screen.getByLabelText("Senha", { exact: true }), { target: { value: "Senha@123" } });
    fireEvent.change(screen.getByLabelText("Confirmar senha"), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("checkbox", { name: /Li e aceito/ }));
    fireEvent.click(screen.getByRole("button", { name: "Continuar" }));
    await waitFor(() => expect(screen.getByTestId("route").textContent).toBe(path));
    expect(ensureStarterWorkspace).not.toHaveBeenCalled();
    expect(useStore.getState().user?.planSelectionRequired).toBe(true);
  });

  it("retoma um pagamento pendente no login", async () => {
    useStore.setState({ user: null });
    vi.mocked(login).mockResolvedValue({ user: { ...newUser, pendingPlanTransactionId: transactionId } });
    renderFlow("/login");
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
    fireEvent.change(screen.getByLabelText("Senha", { exact: true }), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await waitFor(() => expect(screen.getByTestId("route").textContent).toBe(`/checkout/webview/success?transactionId=${transactionId}`));
    expect(ensureStarterWorkspace).not.toHaveBeenCalled();
  });

  it("preserva o acesso de contas que já concluíram a escolha", async () => {
    useStore.setState({ user: null });
    vi.mocked(login).mockResolvedValue({ user: activeUser });
    renderFlow("/login");
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "teste@example.test" } });
    fireEvent.change(screen.getByLabelText("Senha", { exact: true }), { target: { value: "Senha@123" } });
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    await screen.findByText("Painel doméstico");
    expect(ensureStarterWorkspace).toHaveBeenCalledWith("DOMESTIC");
  });

  it("bloqueia o painel enquanto a conta precisa escolher o plano, inclusive após remontagem", async () => {
    renderFlow("/home");
    await screen.findByRole("heading", { name: "Escolha o plano para sua casa" });
    expect(screen.queryByText("Painel doméstico")).toBeNull();
  });
});

describe("escolha e checkout", () => {
  it("ativa o gratuito antes de entrar, sem passar pela tela de pagamento", async () => {
    renderFlow("/plans/domestic");
    fireEvent.click(await screen.findByRole("button", { name: "Começar grátis" }));
    await screen.findByText("Painel doméstico");
    expect(createCheckoutTransaction).toHaveBeenCalledWith({ planCode: "FREE" }, expect.any(AbortSignal));
    expect(finishPlanSelection).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("heading", { name: "Finalizar pagamento" })).toBeNull();
  });

  it("mantém a escolha pendente se a ativação falha", async () => {
    vi.mocked(createCheckoutTransaction).mockRejectedValue(new Error("Ativação indisponível"));
    renderFlow("/plans/domestic");
    fireEvent.click(await screen.findByRole("button", { name: "Começar grátis" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Ativação indisponível");
    expect(useStore.getState().user?.planSelectionRequired).toBe(true);
    expect(finishPlanSelection).not.toHaveBeenCalled();
  });

  it("usa o catálogo real e só envia o plano pago ao confirmar o checkout", async () => {
    vi.mocked(createCheckoutTransaction).mockResolvedValue({ id: transactionId, status: "PENDING", planCode: "PLUS", amount: 37.57 });
    renderFlow("/plans/domestic");
    fireEvent.click(await screen.findByRole("button", { name: "Escolher Plus API" }));
    await screen.findByRole("heading", { name: "Finalizar pagamento" });
    expect(createCheckoutTransaction).not.toHaveBeenCalled();
    fireEvent.click(await screen.findByRole("radio", { name: "Pix" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Li e aceito/ }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmar pagamento/ }));
    await screen.findByRole("heading", { name: "Aguardando confirmação" });
    expect(createCheckoutTransaction).toHaveBeenCalledWith(expect.objectContaining({ planCode: "PLUS", paymentMethod: "PIX" }), expect.any(AbortSignal));
    expect(useStore.getState().user?.planSelectionRequired).toBe(true);
    expect(useStore.getState().user?.pendingPlanTransactionId).toBe(transactionId);
    expect(finishPlanSelection).not.toHaveBeenCalled();
  });

  it("não permite um plano de outro tipo de conta por URL", async () => {
    renderFlow("/checkout?plan=COMMERCIAL&price=0");
    expect((await screen.findByRole("alert")).textContent).toContain("não está disponível");
    expect(screen.queryByRole("button", { name: /Confirmar pagamento/ })).toBeNull();
    expect(createCheckoutTransaction).not.toHaveBeenCalled();
  });

  it("só conclui a conta após aprovação do servidor e ignora valor/nome da URL", async () => {
    vi.mocked(getTransaction).mockResolvedValue({ id: transactionId, status: "APPROVED", planCode: "PLUS", amount: 37.57 });
    renderFlow(`/checkout/webview/success?transactionId=${transactionId}&name=Adulterado&price=0`);
    await screen.findByRole("heading", { name: "Pagamento aprovado" });
    expect(screen.queryByText("Adulterado")).toBeNull();
    expect(screen.getByText(/37,57/)).toBeDefined();
    expect(useStore.getState().user?.planSelectionRequired).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Continuar para o Frigus" }));
    await screen.findByText("Painel doméstico");
    expect(useStore.getState().user?.planSelectionRequired).toBe(false);
  });

  it("volta aos planos após recusa sem liberar o painel", async () => {
    useStore.setState({ user: { ...newUser, pendingPlanTransactionId: transactionId } });
    vi.mocked(getTransaction).mockResolvedValue({ id: transactionId, status: "REJECTED", planCode: "PLUS", amount: 37.57 });
    renderFlow(`/checkout/webview/success?transactionId=${transactionId}`);
    fireEvent.click(await screen.findByRole("button", { name: "Escolher plano e tentar novamente" }));
    await screen.findByRole("heading", { name: "Escolha o plano para sua casa" });
    expect(useStore.getState().user?.planSelectionRequired).toBe(true);
    expect(finishPlanSelection).not.toHaveBeenCalled();
  });

  it("mostra falha de catálogo sem liberar a escolha às cegas", async () => {
    vi.mocked(listPlans).mockRejectedValue(new Error("Catálogo indisponível"));
    renderFlow("/plans/domestic");
    expect((await screen.findByRole("alert")).textContent).toContain("Catálogo indisponível");
    expect(screen.queryByRole("button", { name: "Começar grátis" })).toBeNull();
  });
});
