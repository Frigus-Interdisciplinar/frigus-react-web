import { LoaderCircle } from "lucide-react";
import type { LoadingSpinnerProps } from "@/types/component-props.type";

export default function LoadingSpinner({
  label = "Carregando…",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex min-h-24 items-center justify-center text-frigus-primary dark:text-blue-300 ${className}`}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-8 animate-spin motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
