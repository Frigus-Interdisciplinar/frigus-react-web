// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import Topbar from "@/components/AppLayout/Topbar";
import { useStore } from "@/store/store";

const auth = vi.hoisted(() => ({ logout: vi.fn() }));
vi.mock("@/services/auth.service", () => ({ logout: auth.logout }));
vi.mock("@/components/ThemeToggle", () => ({ default: () => null }));
vi.mock("@/components/AppLayout/Topbar/QuickNotificationsPopover", () => ({
  default: () => null,
  QuickNotificationsPopover: () => null,
}));

function CurrentPath() {
  const location = useLocation();
  return <output data-testid="path">{location.pathname}</output>;
}

function renderTopbar() {
  return render(
    <MemoryRouter initialEntries={["/home"]}>
      <CurrentPath />
      <Routes>
        <Route path="/home" element={<Topbar title="Home" />} />
        <Route path="/login" element={<p>Login</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const user = {
  id: "qa-user",
  name: "Conta de teste",
  email: "qa.logout@example.invalid",
  accountType: "DOMESTIC" as const,
};

describe("logout e estado local da sessão", () => {
  beforeEach(() => {
    auth.logout.mockReset().mockResolvedValue(undefined);
    useStore.setState({ user, initialized: true });
  });

  afterEach(() => {
    cleanup();
    useStore.setState({ user: null, initialized: false });
  });

  it("revoga a sessão, limpa o usuário e navega para login", async () => {
    renderTopbar();
    fireEvent.click(screen.getByRole("button", { name: "Menu da conta" }));
    fireEvent.click(screen.getByRole("button", { name: "Sair da conta" }));

    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/login"));
    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(useStore.getState().user).toBeNull();
  });

  it("desabilita saída repetida enquanto a requisição está em andamento", async () => {
    let finishLogout!: () => void;
    auth.logout.mockReturnValue(new Promise<void>((resolve) => { finishLogout = resolve; }));
    renderTopbar();
    fireEvent.click(screen.getByRole("button", { name: "Menu da conta" }));
    fireEvent.click(screen.getByRole("button", { name: "Sair da conta" }));

    const pendingButton = await screen.findByRole("button", { name: "Saindo…" });
    expect(pendingButton.hasAttribute("disabled")).toBe(true);
    fireEvent.click(pendingButton);
    expect(auth.logout).toHaveBeenCalledTimes(1);
    finishLogout();

    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/login"));
  });

  it("preserva a sessão e informa a falha se o servidor não revogar o token", async () => {
    auth.logout.mockRejectedValue(new Error("Servidor indisponível"));
    renderTopbar();
    fireEvent.click(screen.getByRole("button", { name: "Menu da conta" }));
    fireEvent.click(screen.getByRole("button", { name: "Sair da conta" }));

    expect((await screen.findByRole("alert")).textContent).toContain("Servidor indisponível");
    expect(useStore.getState().user?.id).toBe("qa-user");
    expect(screen.getByTestId("path").textContent).toBe("/home");
  });
});
