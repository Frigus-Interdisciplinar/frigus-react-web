import { useCallback, useEffect, useRef } from "react";

export function useLatestRequest() {
  const current = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      current.current?.abort();
    };
  }, []);
  return useCallback(() => {
    current.current?.abort();
    const controller = new AbortController();
    current.current = controller;
    
    if (!mounted.current) controller.abort();
    return controller.signal;
  }, []);
}
