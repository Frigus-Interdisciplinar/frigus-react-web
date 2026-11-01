import { useEffect, useRef } from "react";

/** Reset modal-owned form state whenever a modal opens or closes. */
export function useResetModalState(isOpen: boolean, reset: () => void) {
  const resetRef = useRef(reset);

  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  useEffect(() => {
    resetRef.current();
  }, [isOpen]);
}
