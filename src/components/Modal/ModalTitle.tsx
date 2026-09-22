import { cn } from "@/utils/cn.util";

export type ModalTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export default function ModalTitle({
  title,
  subtitle,
  className,
}: ModalTitleProps) {
  return (
    <div className={cn("text-left", className)}>
      <h3 className="font-montserrat font-bold text-frigus-navy text-xl">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1 font-sans">{subtitle}</p>
      )}
    </div>
  );
}
