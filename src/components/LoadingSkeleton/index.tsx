import SkeletonBase, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { SkeletonCardProps, SkeletonProps, SkeletonRowsProps } from "@/types/ui-component-props.type";

export function Skeleton({
  className,
  width,
  height,
  circle = false,
}: SkeletonProps) {
  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base)"
      highlightColor="var(--skeleton-highlight)"
    >
      <SkeletonBase
        aria-hidden="true"
        className={className}
        width={width}
        height={height}
        circle={circle}
      />
    </SkeletonTheme>
  );
}

export function SkeletonRows({
  rows = 3,
  className = "space-y-4",
  rowClassName = "",
}: SkeletonRowsProps) {
  return (
    <div role="status" aria-label="Carregando conteúdo" className={className}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={`flex items-center gap-3 ${rowClassName}`}>
          <Skeleton circle width={40} height={40} />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton width="46%" />
            <Skeleton width="72%" height={12} />
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando…</span>
    </div>
  );
}

export function SkeletonCard({
  children,
  className = "",
}: SkeletonCardProps) {
  return (
    <div role="status" aria-label="Carregando conteúdo" className={className}>
      {children}
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
