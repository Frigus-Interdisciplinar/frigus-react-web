import { useId, useState, forwardRef, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn.util";

export type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      type = "text",
      error,
      helperText,
      className,
      showPasswordToggle,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const isPasswordType = type === "password";
    const actualType =
      isPasswordType && (showPasswordToggle ?? true)
        ? isPasswordVisible
          ? "text"
          : "password"
        : type;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-frigus-navy dark:text-gray-200 text-sm font-semibold leading-tight"
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={cn(
              "w-full h-11 bg-white dark:bg-[#1C1E22] rounded-lg border border-[#D5DEED] dark:border-[#343941] px-3.5 text-sm text-[#1B2C62] dark:text-white placeholder:text-text-muted",
              "focus:outline-none focus:ring-2 focus:ring-frigus-primary/30 focus:border-frigus-primary transition-all duration-150",
              isPasswordType && "pr-11",
              error &&
                "border-red-500 dark:border-red-400 focus:ring-red-300 focus:border-red-500",
              className,
            )}
            {...props}
            aria-invalid={error ? true : props["aria-invalid"]}
            aria-describedby={
              [describedBy, (error || helperText) && messageId]
                .filter(Boolean)
                .join(" ") || undefined
            }
          />
          {isPasswordType && (showPasswordToggle ?? true) && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-3 text-[#70809F] hover:text-frigus-primary dark:hover:text-blue-400 transition-colors p-1 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frigus-primary"
              aria-label={isPasswordVisible ? "Ocultar senha" : "Ver senha"}
              aria-pressed={isPasswordVisible}
              aria-controls={inputId}
            >
              {isPasswordVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          )}
        </div>
        {helperText && !error && (
          <span
            id={messageId}
            className="text-xs text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </span>
        )}
        {error && (
          <span
            id={messageId}
            role="alert"
            className="text-xs text-red-700 dark:text-red-300"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
