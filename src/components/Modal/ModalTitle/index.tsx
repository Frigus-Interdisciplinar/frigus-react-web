import { cn } from "@/utils/cn.util";
import type { ModalTitleProps } from "@/types/component-props.type";
export type { ModalTitleProps } from "@/types/component-props.type";

export default function ModalTitle({
  title,
  subtitle,
  className,
}: ModalTitleProps) {
  return (
    <div className={cn("text-left", className)}>
      <h3 id="add-items-dialog-title" className="font-montserrat font-bold text-frigus-navy dark:text-white text-xl">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-sans">{subtitle}</p>
      )}
    </div>
  );
}
