import { useEffect, useState } from "react";

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: string;
};

export function useAbortableAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
  dependencies: readonly unknown[],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T> & { dependencies: readonly unknown[] }>({
    data: undefined,
    loading: true,
    error: "",
    dependencies: [],
  });

  const hasCurrentResult = dependencies.length === state.dependencies.length &&
    dependencies.every((value, index) => Object.is(value, state.dependencies[index]));

  useEffect(() => {
    const controller = new AbortController();
    const requestDependencies = [...dependencies];

    void load(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: "", dependencies: requestDependencies });
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          data: undefined,
          loading: false,
          error: reason instanceof Error ? reason.message : "Não foi possível carregar os dados.",
          dependencies: requestDependencies,
        });
      });

    return () => controller.abort();
    // The caller provides every value used by load in this dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  if (!hasCurrentResult) return { data: undefined, loading: true, error: "" };
  return { data: state.data, loading: state.loading, error: state.error };
}
