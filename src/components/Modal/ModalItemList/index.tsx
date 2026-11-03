import { Check } from "lucide-react";
import { cn } from "@/utils/cn.util";
import type { ModalItemListProps } from "@/types/modal-component-props.type";
export type { ModalItemListProps, SuggestedItem } from "@/types/modal-component-props.type";

export default function ModalItemList({
  items,
  selectedIds,
  onToggleSelect,
  sectionTitle = "Alimentos sugeridos",
  emptyMessage = "Nenhum item encontrado",
}: ModalItemListProps) {
  return (
    <div className="p-6 space-y-3">
      {sectionTitle && (
        <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider text-left">
          {sectionTitle}
        </h4>
      )}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-neutral-500 py-4 text-center">{emptyMessage}</p>
        ) : (
          items.map((item) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <label
                htmlFor={`suggested-item-${item.id}`}
                key={item.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none",
                  isChecked
                    ? "border-frigus-primary bg-blue-50/50 dark:bg-blue-950/40 dark:border-[#5B89F7] shadow-xs"
                    : "border-gray-200/80 dark:border-[#343941] hover:border-gray-300 dark:hover:border-neutral-500 hover:bg-gray-50/50 dark:hover:bg-[#252A32]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex size-5 items-center justify-center">
                    <input id={`suggested-item-${item.id}`} type="checkbox" checked={isChecked} onChange={() => onToggleSelect(item.id)}
                      aria-label={`Selecionar ${item.name}`}
                      className="peer size-5 appearance-none rounded-md border border-gray-400 bg-white checked:border-frigus-primary checked:bg-frigus-primary dark:bg-[#1C1E22] dark:checked:bg-frigus-primary" />
                    <Check aria-hidden="true" size={14} strokeWidth={3} className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100" />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-frigus-navy dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-neutral-400">{item.category}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-frigus-primary dark:text-[#A7BCFF] px-2.5 py-1 bg-white dark:bg-[#252A32] rounded-lg border border-blue-100 dark:border-[#343941]">
                  {item.quantity}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
