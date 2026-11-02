// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useModalFocus } from "@/hooks/useModalFocus";
import ModalItemList from "@/components/Modal/ModalItemList";

function Dialog({ onClose, children }: { onClose: () => void; children?: React.ReactNode }) {
  const ref = useModalFocus(true, onClose);
  return <div ref={ref} role="dialog" tabIndex={-1}>
    <button hidden>Oculto</button>
    <button style={{ visibility: "hidden" }}>Invisível</button>
    <button disabled>Desabilitado</button>
    <button>Primeiro</button>
    <button>Último</button>
    {children}
  </div>;
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getClientRects").mockImplementation(function (this: HTMLElement) {
    return (this.hidden ? [] : [{ width: 20, height: 20 }]) as unknown as DOMRectList;
  });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); document.body.style.overflow = ""; });

describe("foco de janelas", () => {
  it("ignora controles invisíveis, fecha o ciclo de Tab e restaura o foco", () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const { unmount } = render(<Dialog onClose={vi.fn()} />);
    const first = screen.getByRole("button", { name: "Primeiro" });
    const last = screen.getByRole("button", { name: "Último" });
    expect(document.activeElement).toBe(first);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    trigger.focus();
    expect(document.activeElement).toBe(first);
    unmount();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
    trigger.remove();
  });

  it("somente a janela superior recebe Escape e mantém o scroll bloqueado", () => {
    const closeOuter = vi.fn();
    const closeInner = vi.fn();
    const outer = render(<Dialog onClose={closeOuter} />);
    const inner = render(<Dialog onClose={closeInner} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeInner).toHaveBeenCalledTimes(1);
    expect(closeOuter).not.toHaveBeenCalled();
    inner.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeOuter).toHaveBeenCalledTimes(1);
    outer.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("oferece checkbox nativo para escolher alimentos", () => {
    const onToggle = vi.fn();
    render(<ModalItemList items={[{ id: "1", name: "Arroz", category: "Grão", quantity: "1 kg" }]} selectedIds={[]} onToggleSelect={onToggle} />);
    const checkbox = screen.getByRole("checkbox", { name: "Selecionar Arroz" });
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith("1");
  });
});
