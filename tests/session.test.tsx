// @vitest-environment jsdom
import { StrictMode, type ReactNode } from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "@/App";
import { ensureStarterWorkspace, refreshSession } from "@/services/auth.service";
import { useStore } from "@/store/store";
import type { LoginResponseDto } from "@/types/auth.type";

vi.mock("@/services/auth.service", () => ({ refreshSession: vi.fn(), ensureStarterWorkspace: vi.fn() }));
vi.mock("@/contexts", () => ({ AuthProvider: ({ children }: { children: ReactNode }) => children, ThemeProvider: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/contexts/AccessibilityContext", () => ({ AccessibilityProvider: ({ children }: { children: ReactNode }) => children }));
vi.mock("@/components/AccessibilityTools", () => ({ default: () => null }));
vi.mock("@/routes", () => ({ default: () => <div>Aplicativo</div> }));

beforeEach(() => {
  useStore.setState({ user: null, initialized: false });
  vi.mocked(refreshSession).mockReset();
  vi.mocked(ensureStarterWorkspace).mockReset().mockResolvedValue({ id: "group", name: "Casa" });
});
afterEach(() => cleanup());

it("não sobrescreve um login recente com a resposta antiga do bootstrap em StrictMode", async () => {
  let resolve!: (value: LoginResponseDto) => void;
  vi.mocked(refreshSession).mockReturnValue(new Promise((done) => { resolve = done; }));
  render(<StrictMode><App /></StrictMode>);
  expect(refreshSession).toHaveBeenCalledTimes(1);
  const user = { id: "novo", name: "Novo", email: "novo@example.test", accountType: "DOMESTIC" as const };
  act(() => useStore.getState().login(user));
  await act(async () => { resolve({ user: { ...user, id: "antigo" } }); });
  expect(useStore.getState().user?.id).toBe("novo");
  expect(useStore.getState().initialized).toBe(true);
});

it("não publica sessão após a desmontagem do aplicativo", async () => {
  let resolve!: (value: LoginResponseDto) => void;
  vi.mocked(refreshSession).mockReturnValue(new Promise((done) => { resolve = done; }));
  const { unmount } = render(<App />);
  unmount();
  await act(async () => { resolve({ user: { id: "antigo", name: "A", email: "a@example.test", accountType: "DOMESTIC" } }); });
  await waitFor(() => expect(useStore.getState().initialized).toBe(false));
  expect(useStore.getState().user).toBeNull();
});

it("restaura uma conta ativa sem criar um espaço durante o bootstrap", async () => {
  vi.mocked(refreshSession).mockResolvedValue({ user: { id: "u", name: "A", email: "a@example.test", accountType: "DOMESTIC", planSelectionRequired: false } });
  render(<App />);
  await waitFor(() => expect(useStore.getState().initialized).toBe(true));
  expect(ensureStarterWorkspace).not.toHaveBeenCalled();
  expect(useStore.getState().user?.id).toBe("u");
});

it("mantém a autenticação se o helper de preparação do espaço não estiver disponível", async () => {
  vi.mocked(refreshSession).mockResolvedValue({ user: { id: "u", name: "A", email: "a@example.test", accountType: "DOMESTIC", planSelectionRequired: false } });
  vi.mocked(ensureStarterWorkspace).mockRejectedValue(new Error("indisponível"));
  render(<App />);
  await waitFor(() => expect(useStore.getState().initialized).toBe(true));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(ensureStarterWorkspace).not.toHaveBeenCalled();
  expect(useStore.getState().user?.id).toBe("u");
});
