import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Accessibility, RotateCcw, X } from "lucide-react";
import { useAccessibility } from "@/contexts/useAccessibility";

const textScales = [100, 115, 130] as const;

export default function AccessibilityTools() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);
  const {
    textScale,
    highContrast,
    dyslexiaFont,
    vlibrasEnabled,
    setTextScale,
    setHighContrast,
    setDyslexiaFont,
    setVlibrasEnabled,
    resetAccessibility,
  } = useAccessibility();
  const closePanel = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    panelRef.current
      ?.querySelector<HTMLElement>("button, input, select, textarea, a[href]")
      ?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    let observer: MutationObserver | undefined;
    const focusMain = () => {
      const main = document.getElementById("main-content");
      if (!main) return false;
      main.focus({ preventScroll: true });
      return true;
    };
    const frame = requestAnimationFrame(() => {
      if (focusMain()) return;
      observer = new MutationObserver(() => {
        if (focusMain()) observer?.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePanel();
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <a className="a11y-skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>

      <div className="a11y-tools">
        <section
          ref={panelRef}
          id="a11y-panel"
          className="a11y-panel"
          aria-labelledby="a11y-panel-title"
          hidden={!isOpen}
        >
          <div className="a11y-panel-header">
            <h2 id="a11y-panel-title">Acessibilidade</h2>
            <button
              type="button"
              className="a11y-icon-button"
              aria-label="Fechar opções de acessibilidade"
              onClick={closePanel}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="a11y-control">
            <span className="a11y-control-label" id="a11y-text-size-label">
              Tamanho do texto
            </span>
            <div
              className="a11y-segmented-control"
              role="group"
              aria-labelledby="a11y-text-size-label"
            >
              {textScales.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  aria-pressed={textScale === scale}
                  onClick={() => setTextScale(scale)}
                >
                  {scale === 100 ? "Padrão" : `${scale}%`}
                </button>
              ))}
            </div>
          </div>

          <label htmlFor="a11y-high-contrast" className="a11y-toggle-row">
            <span>
              <strong>Alto contraste</strong>
              <small>Realça textos, links e limites</small>
            </span>
            <input
              id="a11y-high-contrast"
              type="checkbox"
              checked={highContrast}
              onChange={(event) => setHighContrast(event.target.checked)}
            />
          </label>

          <label htmlFor="a11y-dyslexia-font" className="a11y-toggle-row">
            <span>
              <strong>Fonte para dislexia</strong>
              <small>Usa uma família tipográfica mais legível</small>
            </span>
            <input
              id="a11y-dyslexia-font"
              type="checkbox"
              checked={dyslexiaFont}
              onChange={(event) => setDyslexiaFont(event.target.checked)}
            />
          </label>

          <label htmlFor="a11y-vlibras" className="a11y-toggle-row">
            <span>
              <strong>Tradutor em Libras</strong>
              <small>Ativa o VLibras do Governo Federal</small>
            </span>
            <input
              id="a11y-vlibras"
              type="checkbox"
              checked={vlibrasEnabled}
              onChange={(event) => setVlibrasEnabled(event.target.checked)}
            />
          </label>

          <p className="a11y-keyboard-hint">
            Navegação por teclado: use Tab e Shift+Tab para percorrer; Enter ou
            Espaço para ativar; Esc para fechar este painel.
          </p>

          <button
            type="button"
            className="a11y-reset-button"
            onClick={resetAccessibility}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Restaurar padrão
          </button>
        </section>

        <button
          ref={triggerRef}
          type="button"
          className="a11y-trigger"
          aria-expanded={isOpen}
          aria-controls="a11y-panel"
          aria-label={
            isOpen
              ? "Fechar opções de acessibilidade"
              : "Abrir opções de acessibilidade"
          }
          onClick={() => setIsOpen((open) => !open)}
        >
          <Accessibility size={21} aria-hidden="true" />
          <span>Acessibilidade</span>
        </button>
      </div>
    </>
  );
}
