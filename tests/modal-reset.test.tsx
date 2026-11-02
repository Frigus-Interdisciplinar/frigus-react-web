// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Modal from "@/components/Modal";
import AddFoodModal from "@/components/Modal/AddFoodModal";
import InviteMemberModal from "@/components/Modal/InviteMemberModal";
import { CommercialAddBatchModal } from "@/components/CommercialAddBatchModal";
import { CommercialFilterStockModal } from "@/components/CommercialFilterStockModal";
import { CommercialManageAccessModal } from "@/components/CommercialManageAccessModal";
import { EnterpriseEditAdModal } from "@/components/EnterpriseEditAdModal";

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(
    function (this: HTMLElement) {
      return (this.hidden ? [] : [{ width: 20, height: 20 }]) as unknown as DOMRectList;
    },
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

function AddFoodHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir alimento
      </button>
      <AddFoodModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={vi.fn().mockResolvedValue(undefined)}
      />
    </>
  );
}

function AddBatchHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir lote
      </button>
      <CommercialAddBatchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

function StockFilterHarness() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todas as categorias");
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir filtros
      </button>
      <output aria-label="Categoria aplicada">{selectedCategory}</output>
      <CommercialFilterStockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </>
  );
}

function SuggestedItemsHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir itens
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={[
          { id: "1", name: "Arroz", category: "Grãos", quantity: "1 kg" },
          { id: "2", name: "Peito de frango", category: "Carnes", quantity: "500 g" },
        ]}
        defaultSelectedIds={["1"]}
      />
    </>
  );
}

function InviteMemberHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir convite
      </button>
      <InviteMemberModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onInvite={vi.fn().mockResolvedValue(undefined)}
      />
    </>
  );
}

function ManageAccessHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir permissões
      </button>
      <CommercialManageAccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memberRole="EDITOR"
      />
    </>
  );
}

function EditAdvertisementHarness() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir anúncio
      </button>
      <EnterpriseEditAdModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={{
          name: "Produto original",
          category: "Congelados",
          price: "R$ 10,00",
          startDate: "01/09/2026",
          endDate: "30/09/2026",
          description: "Descrição original",
        }}
      />
    </>
  );
}

describe("estado de formulários dos modais", () => {
  it("limpa o alimento ao cancelar e reabrir o formulário", () => {
    render(<AddFoodHarness />);
    const name = screen.getByLabelText("NOME DO ALIMENTO");
    fireEvent.change(name, { target: { value: "Banana" } });
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir alimento" }));

    expect(
      (screen.getByLabelText("NOME DO ALIMENTO") as HTMLInputElement).value,
    ).toBe("");
  });

  it("limpa os campos do lote ao cancelar e reabrir", () => {
    render(<AddBatchHarness />);
    const product = screen.getByLabelText("Produto");
    fireEvent.change(product, { target: { value: "Arroz" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir lote" }));

    expect((screen.getByLabelText("Produto") as HTMLInputElement).value).toBe(
      "",
    );
  });

  it("restaura o filtro aplicado depois de cancelar uma alteração", () => {
    render(<StockFilterHarness />);
    fireEvent.click(screen.getByRole("button", { name: "Proteínas" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir filtros" }));
    fireEvent.click(screen.getByRole("button", { name: "Ver resultados" }));

    expect(screen.getByLabelText("Categoria aplicada").textContent).toBe(
      "Todas as categorias",
    );
  });

  it("restaura a busca e os itens padrão ao fechar a seleção doméstica", () => {
    render(<SuggestedItemsHarness />);
    const rice = screen.getByRole("checkbox", { name: "Selecionar Arroz" }) as HTMLInputElement;
    fireEvent.click(rice);
    fireEvent.change(screen.getByPlaceholderText("Buscar alimento"), {
      target: { value: "frango" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir itens" }));

    expect((screen.getByPlaceholderText("Buscar alimento") as HTMLInputElement).value).toBe("");
    expect(
      (screen.getByRole("checkbox", { name: "Selecionar Arroz" }) as HTMLInputElement).checked,
    ).toBe(true);
  });

  it("limpa convite doméstico cancelado antes de reabrir", () => {
    render(<InviteMemberHarness />);
    fireEvent.change(screen.getByLabelText("E-mail"), {
      target: { value: "membro@example.invalid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Visualizar" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir convite" }));

    expect((screen.getByLabelText("E-mail") as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("button", { name: "Pode editar" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("restaura a permissão comercial recebida quando o modal é reaberto", () => {
    render(<ManageAccessHarness />);
    const role = screen.getByLabelText("Função");
    fireEvent.change(role, { target: { value: "VIEWER" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir permissões" }));

    expect((screen.getByLabelText("Função") as HTMLSelectElement).value).toBe("EDITOR");
  });

  it("recarrega os dados originais do anúncio ao cancelar e reabrir", () => {
    render(<EditAdvertisementHarness />);
    const name = screen.getByLabelText("Nome do produto");
    fireEvent.change(name, { target: { value: "Rascunho alterado" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Abrir anúncio" }));

    expect((screen.getByLabelText("Nome do produto") as HTMLInputElement).value).toBe("Produto original");
  });
});
