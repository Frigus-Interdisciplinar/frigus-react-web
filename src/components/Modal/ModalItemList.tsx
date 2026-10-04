import { Check } from "lucide-react";
import { cn } from "@/utils/cn.util";

export type SuggestedItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
};

export type ModalItemListProps = {
  items: SuggestedItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  sectionTitle?: string;
  emptyMessage?: string;
};

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
              <div
                key={item.id}
                onClick={() => onToggleSelect(item.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none",
                  isChecked
                    ? "border-frigus-primary bg-blue-50/50 dark:bg-blue-950/40 dark:border-[#5B89F7] shadow-xs"
                    : "border-gray-200/80 dark:border-[#343941] hover:border-gray-300 dark:hover:border-neutral-500 hover:bg-gray-50/50 dark:hover:bg-[#252A32]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                      isChecked
                        ? "bg-frigus-primary border-frigus-primary text-white"
                        : "border-gray-300 dark:border-neutral-600 bg-white dark:bg-[#1C1E22]"
                    )}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
