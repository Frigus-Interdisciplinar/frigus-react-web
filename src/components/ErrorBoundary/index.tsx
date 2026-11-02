import { Component, type ReactNode } from "react";

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section
        role="alert"
        aria-label="Erro ao abrir a página"
        className="mx-auto max-w-lg space-y-4 p-8 text-center text-text-main"
      >
        <h1 className="text-xl font-bold">
          Não foi possível abrir esta página
        </h1>
        <p>Recarregue a página para tentar novamente.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-frigus-primary px-5 py-3 font-semibold text-white"
        >
          Recarregar página
        </button>
      </section>
    );
  }
}
