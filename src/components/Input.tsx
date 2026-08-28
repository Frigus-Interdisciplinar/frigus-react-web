import { useState, forwardRef, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn.util";

export type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, type = "text", error, className, showPasswordToggle, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordType = type === "password";
    const actualType = isPasswordType && (showPasswordToggle ?? true)
      ? (isPasswordVisible ? "text" : "password")
      : type;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={id}
            className="text-frigus-navy text-[15px] font-semibold leading-tight"
          >
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={id}
            type={actualType}
            className={cn(
              "w-full h-[52px] bg-white rounded-xl border border-[#D5DEED] px-4 text-[15px] text-frigus-dark placeholder:text-[#70809F]",
              "focus:outline-none focus:ring-2 focus:ring-frigus-primary/30 focus:border-frigus-primary transition-all duration-150",
              isPasswordType && "pr-12",
              error && "border-red-500 focus:ring-red-300 focus:border-red-500",
              className
            )}
            {...props}
          />
          {isPasswordType && (showPasswordToggle ?? true) && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3.5 text-[#70809F] hover:text-frigus-primary transition-colors p-1 flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label={isPasswordVisible ? "Ocultar senha" : "Ver senha"}
            >
              {isPasswordVisible ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
