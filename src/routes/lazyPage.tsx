import { lazy, Suspense, type ComponentType } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useLocation } from "react-router-dom";

type PageModule = { default: ComponentType };

export function lazyPage(load: () => Promise<PageModule>) {
  const Page = lazy(load);
  return function LazyPage() {
    const { pathname } = useLocation();
    return (
      <ErrorBoundary key={pathname}>
        <Suspense
          fallback={
            <LoadingSpinner
              label="Carregando página…"
              className="min-h-[45vh]"
            />
          }
        >
          <Page />
        </Suspense>
      </ErrorBoundary>
    );
  };
}
