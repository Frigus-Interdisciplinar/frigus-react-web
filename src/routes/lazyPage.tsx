import { lazy, Suspense, type ComponentType } from "react";

type PageModule = { default: ComponentType };

export function lazyPage(load: () => Promise<PageModule>) {
  const Page = lazy(load);
  return function LazyPage() {
    return (
      <Suspense fallback={<p role="status" aria-live="polite" className="p-8 text-frigus-navy">Carregando página…</p>}>
        <Page />
      </Suspense>
    );
  };
}
