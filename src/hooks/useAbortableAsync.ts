import { useCallback, useEffect, useState } from "react";

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: string;
  reload: () => void;
};

export function useAbortableAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
): AsyncState<T> {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<
    Omit<AsyncState<T>, "reload"> & { load?: typeof load }
  >({
    data: undefined,
    loading: true,
    error: "",
  });
  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: "" }));
    setRevision((current) => current + 1);
  }, []);

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
  }, [load, revision]);

  if (state.load !== load)
    return { data: undefined, loading: true, error: "", reload };
  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    reload,
  };
}
