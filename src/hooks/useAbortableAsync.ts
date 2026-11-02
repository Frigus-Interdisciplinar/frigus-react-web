import { useEffect, useState } from "react";

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: string;
};

export function useAbortableAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T> & { load?: typeof load }>({
    data: undefined,
    loading: true,
    error: "",
  });

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => {
        controller.signal.throwIfAborted();
        return load(controller.signal);
      })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ data, loading: false, error: "", load });
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          data: undefined,
          loading: false,
          error:
            reason instanceof Error
              ? reason.message
              : "Não foi possível carregar os dados.",
          load,
        });
      });

    return () => controller.abort();
  }, [load]);

  if (state.load !== load) return { data: undefined, loading: true, error: "" };
  return { data: state.data, loading: state.loading, error: state.error };
}
