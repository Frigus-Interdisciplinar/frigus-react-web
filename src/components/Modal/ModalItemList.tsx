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
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">
          {sectionTitle}
        </h4>
      )}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">{emptyMessage}</p>
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
                    ? "border-frigus-primary bg-blue-50/50 shadow-xs"
                    : "border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                      isChecked
                        ? "bg-frigus-primary border-frigus-primary text-white"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-frigus-navy">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-frigus-primary px-2.5 py-1 bg-white rounded-lg border border-blue-100">
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
